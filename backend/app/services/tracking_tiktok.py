from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem

logger = get_logger(__name__)

# TikTok Events API v1.3 — single event endpoint
# Docs: https://business-api.tiktok.com/portal/docs?id=1771101130043393
TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/pixel/track/"


async def send_purchase_event(order: Order, items: list[OrderItem]) -> bool:
    if not settings.tiktok_capi_enabled:
        logger.info("tiktok_capi_disabled")
        return False

    # contents: each item as a product object
    contents = [
        {
            "content_id": item.product_id,
            "content_type": "product",
            "quantity": item.quantity,
            "price": float(item.price_kwd),
        }
        for item in items
    ]

    # user object inside context (all hashed per TikTok requirements)
    user: dict[str, Any] = {}
    if order.phone_hash_tiktok:
        user["phone_number"] = order.phone_hash_tiktok
    if order.ttp:
        user["ttp"] = order.ttp

    # context object: ad, page, user, ip, user_agent
    context: dict[str, Any] = {
        "page": {"url": f"{settings.FRONTEND_URL}/thank-you"},
        "user": user,
    }
    if order.ttclid:
        # TikTok Click ID goes in context.ad.callback
        context["ad"] = {"callback": order.ttclid}
    if order.client_ip:
        context["ip"] = order.client_ip  # non-hashed for TikTok CAPI
    if order.user_agent:
        context["user_agent"] = order.user_agent

    # ISO 8601 timestamp required by v1.3
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    event_id = order.event_id_purchase or str(order.id)

    payload: dict[str, Any] = {
        "pixel_code": settings.TIKTOK_PIXEL_CODE,
        # Must match browser pixel event name exactly for deduplication
        "event": "CompletePayment",
        "event_id": event_id,
        "timestamp": ts,
        "context": context,
        "properties": {
            "currency": "KWD",
            "value": float(order.total_kwd),
            "content_type": "product",
            "contents": contents,
        },
    }

    logger.info(
        "tiktok_capi_request",
        order_id=str(order.id),
        event="CompletePayment",
        event_id=event_id,
        timestamp=ts,
        has_phone=bool(order.phone_hash_tiktok),
        has_ttclid=bool(order.ttclid),
        has_ttp=bool(order.ttp),
        has_ip=bool(order.client_ip),
        contents_count=len(contents),
    )

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
            logger.info(
                "tiktok_capi_response",
                order_id=str(order.id),
                http_status=resp.status_code,
                code=data.get("code"),
                message=data.get("message"),
                request_id=data.get("request_id"),
            )
            if resp.status_code == 200 and data.get("code") == 0:
                logger.info("tiktok_capi_sent", order_id=str(order.id))
                return True
            logger.error(
                "tiktok_capi_error",
                order_id=str(order.id),
                http_status=resp.status_code,
                code=data.get("code"),
                message=data.get("message"),
                request_id=data.get("request_id"),
            )
            return False
    except Exception as e:
        logger.error("tiktok_capi_exception", error=str(e), order_id=str(order.id))
        return False
