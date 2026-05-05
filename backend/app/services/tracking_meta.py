from __future__ import annotations

import time
from typing import Any, Optional

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)

META_CAPI_VERSION = "v21.0"


async def send_purchase_event(order: Order, items: list[OrderItem]) -> bool:
    if not settings.meta_capi_enabled:
        logger.info("meta_capi_disabled")
        return False

    content_ids = list({item.product_id for item in items if not item.is_upsell})
    contents = [
        {
            "id": item.product_id,
            "quantity": item.quantity,
            "item_price": float(item.price_kwd),
        }
        for item in items
    ]

    user_data: dict[str, Any] = {
        "ph": [order.phone_hash_meta_snap] if order.phone_hash_meta_snap else [],
    }
    if order.client_ip:
        user_data["client_ip_address"] = order.client_ip
    if order.user_agent:
        user_data["client_user_agent"] = order.user_agent
    if order.fbp:
        user_data["fbp"] = order.fbp
    if order.fbc:
        user_data["fbc"] = order.fbc

    event: dict[str, Any] = {
        "event_name": "Purchase",
        "event_time": int(time.time()),
        "event_id": order.event_id_purchase or str(order.id),
        "action_source": "website",
        "event_source_url": f"{settings.FRONTEND_URL}/thank-you",
        "user_data": user_data,
        "custom_data": {
            "currency": "KWD",
            "value": float(order.total_kwd),
            "order_id": order.order_number,
            "content_ids": content_ids,
            "contents": contents,
            "content_type": "product",
        },
    }

    payload: dict[str, Any] = {"data": [event]}

    if settings.TRACKING_TEST_MODE and settings.META_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.META_TEST_EVENT_CODE

    url = (
        f"https://graph.facebook.com/{META_CAPI_VERSION}"
        f"/{settings.META_PIXEL_ID}/events"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                url,
                json=payload,
                params={"access_token": settings.META_ACCESS_TOKEN},
            )
            if resp.status_code == 200:
                logger.info("meta_capi_sent", order_id=str(order.id))
                return True
            logger.error(
                "meta_capi_error",
                status=resp.status_code,
                body=resp.text[:300],
                order_id=str(order.id),
            )
            return False
    except Exception as e:
        logger.error("meta_capi_exception", error=str(e), order_id=str(order.id))
        return False
