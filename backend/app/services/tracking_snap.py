from __future__ import annotations

import time
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"


async def send_purchase_event(order: Order, items: list[OrderItem]) -> bool:
    if not settings.snap_capi_enabled:
        logger.info("snap_capi_disabled")
        return False

    content_ids = list({item.product_id for item in items})

    user_data: dict[str, Any] = {}
    if order.phone_hash_meta_snap:
        user_data["hashed_phone_number"] = order.phone_hash_meta_snap
    if order.client_ip:
        user_data["client_ip_address"] = order.client_ip
    if order.user_agent:
        user_data["client_user_agent"] = order.user_agent
    if order.sc_click_id:
        user_data["click_id"] = order.sc_click_id

    event: dict[str, Any] = {
        "event_name": "PURCHASE",
        "event_time": int(time.time()),
        "event_id": order.event_id_purchase or str(order.id),
        "action_source": "WEB",
        "event_source_url": f"{settings.FRONTEND_URL}/thank-you",
        "user_data": user_data,
        "custom_data": {
            "currency": "KWD",
            "value": float(order.total_kwd),
            "order_id": order.order_number,
            "content_ids": content_ids,
        },
    }

    payload: dict[str, Any] = {
        "pixel_id": settings.SNAP_PIXEL_ID,
        "events": [event],
    }

    if settings.TRACKING_TEST_MODE:
        payload["test_event_code"] = "test"

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
            if resp.status_code in (200, 204):
                logger.info("snap_capi_sent", order_id=str(order.id))
                return True
            logger.error(
                "snap_capi_error",
                status=resp.status_code,
                body=resp.text[:300],
                order_id=str(order.id),
            )
            return False
    except Exception as e:
        logger.error("snap_capi_exception", error=str(e), order_id=str(order.id))
        return False
