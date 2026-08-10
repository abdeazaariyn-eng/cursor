from __future__ import annotations

import hashlib
import time
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)

# Snap Conversions API v2 — flat payload per event (not nested events array)
SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"


def _hash_ip(ip: str) -> str:
    """SHA256 hash of an IP address as required by Snap CAPI."""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


async def send_purchase_event(order: Order, items: list[OrderItem]) -> bool:
    if not settings.snap_capi_enabled:
        logger.info("snap_capi_disabled")
        return False

    item_ids = list({item.product_id for item in items})

    # Snap CAPI v2 uses a flat JSON body (NOT a nested events array like Meta)
    # Required: pixel_id, timestamp, event_type, event_conversion_type
    # Required for ROAS: price (number), currency, transaction_id
    # Dedup: client_dedup_id (48h window) + transaction_id (30d window)
    payload: dict[str, Any] = {
        "pixel_id": settings.SNAP_PIXEL_ID,
        "timestamp": str(int(time.time() * 1000)),  # milliseconds
        "event_type": "PURCHASE",
        "event_conversion_type": "WEB",
        "page_url": f"{settings.FRONTEND_URL}/thank-you",
        "price": float(order.total_kwd),  # number, not string
        "currency": "KWD",
        "transaction_id": order.order_number,
        "item_ids": item_ids,
        "number_items": sum(i.quantity for i in items),  # number, not string
        # Deduplication: same client_dedup_id used in browser pixel
        "client_dedup_id": order.event_id_purchase or str(order.id),
    }

    if order.phone_hash_meta_snap:
        payload["hashed_phone_number"] = order.phone_hash_meta_snap
    if order.client_ip:
        payload["hashed_ip_address"] = _hash_ip(order.client_ip)
    if order.user_agent:
        payload["user_agent"] = order.user_agent
    if order.sc_click_id:
        payload["click_id"] = order.sc_click_id

    logger.info(
        "snap_capi_request",
        order_id=str(order.id),
        event_type="PURCHASE",
        client_dedup_id=payload["client_dedup_id"],
        transaction_id=payload["transaction_id"],
        price=payload["price"],
        has_phone=bool(order.phone_hash_meta_snap),
        has_ip=bool(order.client_ip),
        has_click_id=bool(order.sc_click_id),
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                SNAP_CAPI_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {settings.SNAP_ACCESS_TOKEN}",
                    "Content-Type": "application/json",
                },
            )
            try:
                body = resp.json()
            except Exception:
                body = resp.text

            if resp.status_code in (200, 204):
                logger.info(
                    "snap_capi_sent",
                    order_id=str(order.id),
                    status=resp.status_code,
                    response=str(body)[:300],
                )
                return True
            logger.error(
                "snap_capi_error",
                order_id=str(order.id),
                status=resp.status_code,
                response=str(body)[:300],
            )
            return False
    except Exception as e:
        logger.error("snap_capi_exception", error=str(e), order_id=str(order.id))
        return False
