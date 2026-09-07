from __future__ import annotations

import base64
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import func, select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, TrackingEvent, OrderItem
from app.db.session import get_db
from app.schemas.orders import (
    AdminOrderDetail,
    CODSyncInfo,
    OrderItemOut,
    UpdateCODStatusRequest,
    UpdateOrderStatusRequest,
    RetrySheetSyncRequest,
)
from app.services import sheets
from app.services.cod import CODService

logger = get_logger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, settings.ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, settings.ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@router.get("/metrics")
async def get_metrics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    query_orders = select(func.count(Order.id), func.sum(Order.total_kwd)).where(Order.status != "cancelled")
    query_clicks = select(func.count(TrackingEvent.id)).where(TrackingEvent.event_name == "click")
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query_orders = query_orders.where(Order.created_at >= start_dt)
        query_clicks = query_clicks.where(TrackingEvent.created_at >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date) + timedelta(days=1)
        query_orders = query_orders.where(Order.created_at < end_dt)
        query_clicks = query_clicks.where(TrackingEvent.created_at < end_dt)
        
    result_orders = await db.execute(query_orders)
    orders_count, revenue = result_orders.first() or (0, 0)
    
    result_clicks = await db.execute(query_clicks)
    clicks_count = result_clicks.scalar() or 0
    
    conversion_rate = (orders_count / clicks_count * 100) if clicks_count and clicks_count > 0 else 0
    
    return {
        "orders": orders_count,
        "revenue": float(revenue) if revenue else 0,
        "clicks": clicks_count,
        "conversion_rate": round(conversion_rate, 2)
    }

@router.get("/orders")
async def get_orders(
    page: int = 1,
    limit: int = 50,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * limit
    
    query = select(Order).order_by(desc(Order.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return {
        "orders": [
            {
                "id": str(o.id),
                "order_number": o.order_number,
                "customer_name": o.customer_name,
                "phone": o.phone_raw,
                "status": o.status,
                "order_status": o.order_status,
                "cod_sync_status": o.cod_sync_status,
                "total_kwd": float(o.total_kwd),
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "client_ip": o.client_ip
            } for o in orders
        ]
    }


@router.get("/orders/{order_id}")
async def get_order_detail(
    order_id: str,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
) -> AdminOrderDetail:
    """Get detailed order information including items and COD sync status"""
    try:
        from uuid import UUID
        UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == UUID(order_id))
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    items = [
        OrderItemOut(
            productId=item.product_id,
            productNameAr=item.product_name_ar,
            offerId=item.offer_id,
            quantity=item.quantity,
            priceKwd=float(item.price_kwd),
            isUpsell=item.is_upsell,
        )
        for item in order.items
    ]
    
    cod_info = CODSyncInfo(
        syncStatus=order.cod_sync_status,
        codOrderId=order.cod_order_id,
        trackingNumber=order.cod_tracking_number,
        lastSync=order.cod_last_sync.isoformat() if order.cod_last_sync else None,
        syncError=order.cod_sync_error,
    )
    
    return AdminOrderDetail(
        orderId=str(order.id),
        orderNumber=order.order_number,
        orderStatus=order.order_status,
        totalKwd=float(order.total_kwd),
        customerName=order.customer_name,
        customerPhone=order.phone_e164,
        country=order.country,
        city=order.city,
        area=order.area,
        address=order.address,
        notes=order.notes,
        items=items,
        cod=cod_info,
        sheetSyncStatus=order.sheet_sync_status,
        sheetSyncError=order.sheet_sync_error,
        createdAt=order.created_at.isoformat() if order.created_at else "",
        updatedAt=order.updated_at.isoformat() if order.updated_at else "",
    )


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    request: UpdateOrderStatusRequest,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update order fulfillment status"""
    try:
        from uuid import UUID
        UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Validate status
    valid_statuses = ["new", "confirmed", "processing", "sent", "delivered", "cancelled", "returned"]
    if request.orderStatus and request.orderStatus not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid order status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    result = await db.execute(select(Order).where(Order.id == UUID(order_id)))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    if request.orderStatus:
        order.order_status = request.orderStatus
        order.updated_at = datetime.now(tz=timezone.utc)
        await db.commit()
        logger.info(
            "order_status_updated",
            order_id=order_id,
            status=request.orderStatus,
            admin=admin,
        )
    
    return {
        "id": str(order.id),
        "order_status": order.order_status,
        "updated_at": order.updated_at.isoformat() if order.updated_at else None,
    }


@router.patch("/orders/{order_id}/cod-status")
async def update_cod_status(
    order_id: str,
    request: UpdateCODStatusRequest,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update COD sync status"""
    try:
        from uuid import UUID
        UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Validate COD sync status
    valid_statuses = ["pending", "sent", "failed"]
    if request.codSyncStatus and request.codSyncStatus not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid COD sync status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    result = await db.execute(select(Order).where(Order.id == UUID(order_id)))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    if request.codSyncStatus:
        order.cod_sync_status = request.codSyncStatus
    if request.codOrderId:
        order.cod_order_id = request.codOrderId
    if request.codTrackingNumber:
        order.cod_tracking_number = request.codTrackingNumber
    if request.syncError is not None:
        order.cod_sync_error = request.syncError
    
    order.cod_last_sync = datetime.now(tz=timezone.utc)
    await db.commit()
    
    logger.info(
        "cod_status_updated",
        order_id=order_id,
        cod_sync_status=request.codSyncStatus,
        admin=admin,
    )
    
    return {
        "id": str(order.id),
        "cod_sync_status": order.cod_sync_status,
        "cod_order_id": order.cod_order_id,
        "cod_tracking_number": order.cod_tracking_number,
        "cod_last_sync": order.cod_last_sync.isoformat() if order.cod_last_sync else None,
    }


@router.post("/orders/{order_id}/retry-sheet-sync")
async def retry_sheet_sync(
    order_id: str,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    """Retry Google Sheets sync for an order"""
    try:
        from uuid import UUID
        UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == UUID(order_id))
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Retry sheet sync
    success = await sheets.send_order_to_sheets(order, order.items, retries=2)
    
    if success:
        order.sheet_sync_status = "sent"
        order.sheet_sync_error = None
    else:
        order.sheet_sync_status = "failed"
    
    await db.commit()
    
    logger.info(
        "sheet_sync_retried",
        order_id=order_id,
        success=success,
        admin=admin,
    )
    
    return {
        "id": str(order.id),
        "sheet_sync_status": order.sheet_sync_status,
        "sheet_sync_error": order.sheet_sync_error,
    }


@router.post("/orders/{order_id}/retry-cod-sync")
async def retry_cod_sync(
    order_id: str,
    admin: str = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    """Retry COD sync for an order"""
    try:
        from uuid import UUID
        order_uuid = UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    result = await db.execute(select(Order).where(Order.id == order_uuid))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Retry COD sync
    success = await CODService.retry_sync(db, order_uuid)
    
    logger.info(
        "cod_sync_retried",
        order_id=order_id,
        success=success,
        admin=admin,
    )
    
    return {
        "id": str(order.id),
        "cod_sync_status": order.cod_sync_status,
        "cod_order_id": order.cod_order_id,
        "cod_tracking_number": order.cod_tracking_number,
        "cod_sync_error": order.cod_sync_error,
        "success": success,
    }
