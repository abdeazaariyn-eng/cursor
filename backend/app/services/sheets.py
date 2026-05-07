from __future__ import annotations

import asyncio
from typing import Optional
from datetime import datetime

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem
from app.services.orders import PRODUCT_CATALOG

logger = get_logger(__name__)

async def send_order_to_sheets(
    order: Order,
    items: list[OrderItem],
    retries: int = 2,
) -> bool:
    if not settings.sheets_enabled:
        logger.info("sheets_webhook_disabled", order_id=str(order.id))
        return False

    product_names = []
    skus = []
    quantities = []
    
    for item in items:
        product_names.append(item.product_name_ar)
        sku = PRODUCT_CATALOG.get(item.product_id, {}).get("sku", "")
        skus.append(sku)
        quantities.append(str(item.quantity))

    # Format date as DD/MM/YYYY
    formatted_date = ""
    if order.created_at:
        formatted_date = order.created_at.strftime("%d/%m/%Y")

    # Format phone (must start with 965 and strip others if possible, though phone_e164 handles this partially, we will just prepend 965 to digits if needed or use e164 stripped of +)
    # The user asked for "9650501020304" etc.
    phone = "".join(filter(str.isdigit, order.phone_raw))
    if not phone.startswith("965"):
        phone = "965" + phone

    payload = {
        "date": formatted_date,
        "orderid": order.order_number,
        "country": "Kwt",
        "name": order.customer_name,
        "phone": phone,
        "product": "/".join(product_names),
        "sku": "/".join(skus),
        "quantity": "/".join(quantities),
        "total_price": float(order.total_kwd),
        "currency": "KWD",
        "status": ""
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
