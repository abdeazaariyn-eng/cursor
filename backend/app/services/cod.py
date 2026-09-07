"""
COD (Cash on Delivery) Network integration service.

This service handles synchronization with COD provider APIs.
Currently prepared as a clean service layer for future integration.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order

logger = get_logger(__name__)


class CODService:
    """Service for COD Network integration"""

    @staticmethod
    async def sync_order_to_cod(
        db: AsyncSession,
        order_id: UUID,
        force: bool = False,
    ) -> bool:
        """
        Synchronize an order to COD Network.
        
        Args:
            db: Database session
            order_id: Order UUID
            force: Force resync even if already sent
            
        Returns:
            True if sync successful, False otherwise
        """
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        
        if not order:
            logger.error("cod_sync_order_not_found", order_id=str(order_id))
            return False

        # If already synced and not forcing, skip
        if order.cod_sync_status == "sent" and not force:
            logger.info("cod_sync_already_sent", order_id=str(order_id))
            return True

        # Check if COD integration is configured
        if not settings.COD_API_ENDPOINT or not settings.COD_API_KEY:
            logger.warning("cod_not_configured", order_id=str(order_id))
            order.cod_sync_status = "pending"
            await db.commit()
            return False

        try:
            # Prepare COD payload with order details
            payload = _prepare_cod_payload(order)

            # Call COD API (placeholder - actual implementation would use httpx)
            success, cod_order_id, error = await _call_cod_api(payload)

            if success:
                order.cod_sync_status = "sent"
                order.cod_order_id = cod_order_id
                order.cod_last_sync = datetime.now(tz=timezone.utc)
                order.cod_sync_error = None
                logger.info(
                    "cod_sync_success",
                    order_id=str(order_id),
                    cod_order_id=cod_order_id,
                )
            else:
                order.cod_sync_status = "failed"
                order.cod_sync_error = error
                logger.error(
                    "cod_sync_failed",
                    order_id=str(order_id),
                    error=error,
                )

            await db.commit()
            return success

        except Exception as e:
            logger.exception(
                "cod_sync_exception",
                order_id=str(order_id),
                error=str(e),
            )
            order.cod_sync_status = "failed"
            order.cod_sync_error = str(e)
            await db.commit()
            return False

    @staticmethod
    async def retry_sync(
        db: AsyncSession,
        order_id: UUID,
    ) -> bool:
        """Retry COD sync for a failed order"""
        return await CODService.sync_order_to_cod(db, order_id, force=True)


def _prepare_cod_payload(order: Order) -> dict:
    """Prepare order data for COD API"""
    items = []
    for item in order.items:
        items.append({
            "sku": item.sku or item.product_id,
            "name_ar": item.product_name_ar,
            "quantity": item.quantity,
            "unit_price": float(item.price_kwd),
            "color": item.product_color,
        })

    return {
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "customer_phone": order.phone_e164,
        "country": order.country or "KW",
        "city": order.city,
        "area": order.area,
        "address": order.address,
        "notes": order.notes,
        "items": items,
        "total_amount": float(order.total_kwd),
        "currency": order.currency,
    }


async def _call_cod_api(payload: dict) -> tuple[bool, Optional[str], Optional[str]]:
    """
    Call COD Network API to create shipment.
    
    Returns:
        Tuple of (success, cod_order_id, error_message)
    """
    # Placeholder implementation
    # In production, this would use httpx to call the actual COD API
    # For now, we just log and return placeholder values
    
    logger.info("cod_api_call_placeholder", payload_keys=list(payload.keys()))
    # When real API is available, implement like:
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(
    #         settings.COD_API_ENDPOINT + "/orders",
    #         json=payload,
    #         headers={"Authorization": f"Bearer {settings.COD_API_KEY}"}
    #     )
    #     if response.status_code == 201:
    #         data = response.json()
    #         return True, data.get("order_id"), None
    #     else:
    #         return False, None, f"HTTP {response.status_code}"
    
    return False, None, "COD API not yet configured"
