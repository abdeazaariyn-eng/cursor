from __future__ import annotations

import time
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)

TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


async def send_purchase_event(order: Order, items: list[OrderItem]) -> bool:
    if not settings.tiktok_capi_enabled:
        logger.info("tiktok_capi_disabled")
        return False

    contents = [
        {
            "content_id": item.product_id,
            "content_type": "product",
            "quantity": item.quantity,
            "price": float(item.price_kwd),
        }
        for item in items
    ]

    user_data: dict[str, Any] = {}
    if order.phone_hash_tiktok:
        user_data["phone_number"] = order.phone_hash_tiktok
    if order.ttp:
        user_data["ttp"] = order.ttp
    if order.ttclid:
        user_data["ttclid"] = order.ttclid
    if order.client_ip:
        user_data["ip"] = order.client_ip
    if order.user_agent:
        user_data["user_agent"] = order.user_agent

    event: dict[str, Any] = {
        "event": "CompletePayment",
        "event_time": int(time.time()),
        "event_id": order.event_id_purchase or str(order.id),
        "user": user_data,
        "properties": {
            "currency": "KWD",
            "value": float(order.total_kwd),
            "order_id": order.order_number,
            "contents": contents,
        },
    }

    payload: dict[str, Any] = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_CODE,
        "data": [event],
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                TIKTOK_EVENTS_API_URL,
                json=payload,
                headers={
                    "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
                    "Content-Type": "application/json",
                },
            )
            data = resp.json()
            if resp.status_code == 200 and data.get("code") == 0:
                logger.info("tiktok_capi_sent", order_id=str(order.id))
                return True
            logger.error(
                "tiktok_capi_error",
                status=resp.status_code,
                body=str(data)[:300],
                order_id=str(order.id),
            )
            return False
    except Exception as e:
        logger.error("tiktok_capi_exception", error=str(e), order_id=str(order.id))
        return False
