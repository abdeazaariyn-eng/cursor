from __future__ import annotations

import asyncio
from typing import Optional

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)


def _build_items_summary(items: list[OrderItem]) -> str:
    parts = []
    for item in items:
        parts.append(f"{item.product_name_ar} x{item.quantity}")
    return " + ".join(parts)


async def send_order_to_sheets(
    order: Order,
    items: list[OrderItem],
    retries: int = 2,
) -> bool:
    if not settings.sheets_enabled:
        logger.info("sheets_webhook_disabled", order_id=str(order.id))
        return False

    items_summary = _build_items_summary(items)

    payload = {
        "secret": settings.GOOGLE_SHEETS_WEBHOOK_SECRET,
        "order": {
            "order_number": order.order_number,
            "created_at": order.created_at.isoformat() if order.created_at else "",
            "customer_name": order.customer_name,
            "phone_domestic": order.phone_domestic,
            "phone_e164": order.phone_e164,
            "items_summary": items_summary,
            "subtotal_kwd": float(order.subtotal_kwd),
            "discount_kwd": float(order.discount_kwd),
            "total_kwd": float(order.total_kwd),
            "status": order.status,
            "upsell_status": order.upsell_status,
            "landing_page": order.landing_page or "",
            "utm_source": order.utm_source or "",
            "utm_medium": order.utm_medium or "",
            "utm_campaign": order.utm_campaign or "",
            "utm_content": order.utm_content or "",
            "utm_term": order.utm_term or "",
            "notes": "",
        },
        "items": [
            {
                "order_number": order.order_number,
                "product_id": item.product_id,
                "product_name_ar": item.product_name_ar,
                "offer_id": item.offer_id,
                "quantity": item.quantity,
                "price_kwd": float(item.price_kwd),
                "is_upsell": item.is_upsell,
            }
            for item in items
        ],
    }

    last_error: Optional[str] = None
    async with httpx.AsyncClient(timeout=10.0) as client:
        for attempt in range(retries + 1):
            try:
                response = await client.post(
                    settings.GOOGLE_SHEETS_WEBHOOK_URL,
                    json=payload,
                )
                if response.status_code == 200:
                    logger.info(
                        "sheets_webhook_sent",
                        order_id=str(order.id),
                        order_number=order.order_number,
                    )
                    return True
                last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                logger.warning(
                    "sheets_webhook_error",
                    attempt=attempt,
                    status=response.status_code,
                    order_id=str(order.id),
                )
            except httpx.TimeoutException:
                last_error = "Request timeout"
                logger.warning("sheets_webhook_timeout", attempt=attempt, order_id=str(order.id))
            except Exception as e:
                last_error = str(e)
                logger.error("sheets_webhook_exception", attempt=attempt, error=str(e), order_id=str(order.id))

            if attempt < retries:
                await asyncio.sleep(2 ** attempt)

    logger.error(
        "sheets_webhook_all_attempts_failed",
        order_id=str(order.id),
        last_error=last_error,
    )
    return False
