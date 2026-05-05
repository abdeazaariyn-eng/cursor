from __future__ import annotations

import asyncio
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.db.session import get_db
from app.schemas.orders import (
    CreateOrderRequest,
    CreateOrderResponse,
    FinalizeRequest,
    FinalizeResponse,
    GetOrderResponse,
    OrderItemOut,
    RecommendedUpsell,
    UpsellRequest,
    UpsellResponse,
)
from app.services import orders as order_service
from app.services import sheets, tracking_meta, tracking_snap, tracking_tiktok
from app.services.maxmind import check_ip_allowed

logger = get_logger(__name__)

router = APIRouter(prefix="/orders", tags=["orders"])


def _get_client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("", response_model=CreateOrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: CreateOrderRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> CreateOrderResponse:
    client_ip = _get_client_ip(request)
    user_agent = request.headers.get("User-Agent")

    is_allowed = await check_ip_allowed(client_ip, payload.customer.phone)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "ORDER_NOT_ALLOWED", "message": "عذراً، لا يمكننا قبول طلبك في الوقت الحالي."}},
        )

    try:
        order = await order_service.create_order(db, payload, client_ip, user_agent)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "INVALID_PHONE", "message": str(exc)}},
        ) from exc

    cart_product_ids = [item.productId for item in payload.items]
    recommended_product_id = order_service.get_upsell_recommendation(cart_product_ids)

    recommended_upsell = None
    if recommended_product_id:
        recommended_upsell = RecommendedUpsell(
            productId=recommended_product_id,
            priceKwd=9,
        )

    logger.info(
        "order_created",
        order_id=str(order.id),
        order_number=order.order_number,
        total=float(order.total_kwd),
    )

    return CreateOrderResponse(
        orderId=str(order.id),
        orderNumber=order.order_number,
        status=order.status,
        totalKwd=float(order.total_kwd),
        recommendedUpsell=recommended_upsell,
    )


@router.patch("/{order_id}/upsell", response_model=UpsellResponse)
async def handle_upsell(
    order_id: str,
    payload: UpsellRequest,
    db: AsyncSession = Depends(get_db),
) -> UpsellResponse:
    try:
        uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    try:
        order = await order_service.apply_upsell(
            db, order_id, payload.action, payload.productId
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "UPSELL_ERROR", "message": str(exc)}},
        ) from exc

    return UpsellResponse(
        orderId=str(order.id),
        upsellStatus=order.upsell_status,
        totalKwd=float(order.total_kwd),
    )


@router.post("/{order_id}/finalize", response_model=FinalizeResponse)
async def finalize_order(
    order_id: str,
    payload: FinalizeRequest,
    db: AsyncSession = Depends(get_db),
) -> FinalizeResponse:
    try:
        uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    try:
        order = await order_service.finalize_order(
            db,
            order_id,
            payload.purchaseEventId,
            payload.browserEventSent,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "FINALIZE_ERROR", "message": str(exc)}},
        ) from exc

    asyncio.create_task(_fire_post_finalize(order))

    thank_you_url = f"{settings.FRONTEND_URL}/thank-you?order_id={order_id}"

    return FinalizeResponse(
        orderId=str(order.id),
        orderNumber=order.order_number,
        status=order.status,
        thankYouUrl=thank_you_url,
    )


@router.get("/{order_id}", response_model=GetOrderResponse)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
) -> GetOrderResponse:
    try:
        uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order = await order_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return GetOrderResponse(
        orderId=str(order.id),
        orderNumber=order.order_number,
        status=order.status,
        totalKwd=float(order.total_kwd),
        customerName=order.customer_name,
        items=[
            OrderItemOut(
                productId=item.product_id,
                productNameAr=item.product_name_ar,
                offerId=item.offer_id,
                quantity=item.quantity,
                priceKwd=float(item.price_kwd),
                isUpsell=item.is_upsell,
            )
            for item in order.items
        ],
        createdAt=order.created_at.isoformat() if order.created_at else "",
    )


async def _fire_post_finalize(order: object) -> None:
    """
    Fire Google Sheets webhook and CAPI events after order finalize.
    Errors here must not block the customer-facing response.
    """
    from app.db.session import AsyncSessionFactory
    from sqlalchemy import select
    from app.db.models import Order as OrderModel, OrderItem

    try:
        async with AsyncSessionFactory() as db:
            result = await db.execute(
                select(OrderModel).where(OrderModel.id == order.id)  # type: ignore[attr-defined]
            )
            order_db = result.scalar_one_or_none()
            if not order_db:
                return

            items_result = await db.execute(
                select(OrderItem).where(OrderItem.order_id == order_db.id)
            )
            items = list(items_result.scalars().all())

            sheets_ok = await sheets.send_order_to_sheets(order_db, items)

            if sheets_ok:
                order_db.sheet_sync_status = "sent"
            else:
                order_db.sheet_sync_status = "failed"
                order_db.sheet_sync_error = "Webhook failed after retries"

            await db.commit()

            await asyncio.gather(
                tracking_meta.send_purchase_event(order_db, items),
                tracking_tiktok.send_purchase_event(order_db, items),
                tracking_snap.send_purchase_event(order_db, items),
                return_exceptions=True,
            )
    except Exception as exc:
        logger.error("post_finalize_error", error=str(exc))
