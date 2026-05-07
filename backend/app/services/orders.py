from __future__ import annotations

import re
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.db.models import Order, OrderItem
from app.schemas.orders import AttributionIn, CreateOrderRequest, EventsIn
from app.services.hashing import hash_meta_snap, hash_tiktok
from app.services.phone import normalize_phone

logger = get_logger(__name__)

PRODUCT_CATALOG: dict[str, dict[str, str]] = {
    "baby_head_protection_mask": {
        "id": "baby_head_protection_mask",
        "slug": "baby-head-protection-mask",
        "name_ar": "قناع الحماية الناعم لرأس الأطفال",
        "sku": "MAHD-BHP-001",
    },
    "portable_baby_bottle_warmer": {
        "id": "portable_baby_bottle_warmer",
        "slug": "portable-baby-bottle-warmer",
        "name_ar": "جهاز تدفئة زجاجات حليب الأطفال المحمول",
        "sku": "MAHD-PBB-002",
    },
    "wearable_electric_breast_pump": {
        "id": "wearable_electric_breast_pump",
        "slug": "wearable-electric-breast-pump",
        "name_ar": "مضخة ثدي كهربائية جديدة قابلة للارتداء",
        "sku": "MAHD-WEB-003",
    },
}

PRICE_RULES: dict[str, dict[str, int | Decimal]] = {
    "one_piece": {"quantity": 1, "price_kwd": Decimal("19"), "original_price_kwd": Decimal("19")},
    "two_pieces": {"quantity": 2, "price_kwd": Decimal("27"), "original_price_kwd": Decimal("38")},
    "three_pieces": {"quantity": 3, "price_kwd": Decimal("33"), "original_price_kwd": Decimal("57")},
    "upsell_9kwd": {"quantity": 1, "price_kwd": Decimal("9"), "original_price_kwd": Decimal("19")},
}

CROSS_SELL_PRIORITY: dict[str, list[str]] = {
    "baby_head_protection_mask": ["portable_baby_bottle_warmer", "wearable_electric_breast_pump"],
    "portable_baby_bottle_warmer": ["baby_head_protection_mask", "wearable_electric_breast_pump"],
    "wearable_electric_breast_pump": ["portable_baby_bottle_warmer", "baby_head_protection_mask"],
}


def get_upsell_recommendation(cart_product_ids: list[str]) -> Optional[str]:
    all_products = list(PRODUCT_CATALOG.keys())
    for pid in all_products:
        if pid not in cart_product_ids:
            if pid != "wearable_electric_breast_pump" or len(cart_product_ids) < 2:
                return pid
    for pid in ["baby_head_protection_mask", "portable_baby_bottle_warmer"]:
        if pid in PRODUCT_CATALOG:
            return pid
    return None


async def generate_order_number(db: AsyncSession) -> str:
    today = datetime.now(tz=timezone.utc).strftime("%Y%m%d")
    result = await db.execute(
        select(func.count()).where(
            Order.order_number.like(f"mahd-{today}-%")
        )
    )
    count = result.scalar() or 0
    return f"mahd-{today}-{count + 1:04d}"


async def create_order(
    db: AsyncSession,
    request: CreateOrderRequest,
    client_ip: Optional[str],
    user_agent: Optional[str],
) -> Order:
    phone_data = normalize_phone(request.customer.phone)

    phone_hash_meta = hash_meta_snap(phone_data["digits"])
    phone_hash_tt = hash_tiktok(phone_data["e164"])

    subtotal = Decimal("0")
    for item in request.items:
        if item.offerId not in PRICE_RULES:
            raise ValueError(f"عرض السعر غير صحيح: {item.offerId}")
        price_rule = PRICE_RULES[item.offerId]
        subtotal += Decimal(str(price_rule["price_kwd"]))

    total = subtotal
    discount = Decimal("0")

    order_number = await generate_order_number(db)

    attribution = request.attribution or AttributionIn()
    events = request.events or EventsIn()

    order = Order(
        order_number=order_number,
        customer_name=request.customer.name,
        phone_raw=request.customer.phone,
        phone_domestic=phone_data["domestic"],
        phone_e164=phone_data["e164"],
        phone_hash_meta_snap=phone_hash_meta,
        phone_hash_tiktok=phone_hash_tt,
        status="pending_upsell",
        upsell_status="not_shown",
        currency="KWD",
        subtotal_kwd=subtotal,
        discount_kwd=discount,
        total_kwd=total,
        source=attribution.source,
        landing_page=attribution.landingPage,
        utm_source=attribution.utmSource,
        utm_medium=attribution.utmMedium,
        utm_campaign=attribution.utmCampaign,
        utm_content=attribution.utmContent,
        utm_term=attribution.utmTerm,
        fbp=attribution.fbp,
        fbc=attribution.fbc,
        ttp=attribution.ttp,
        ttclid=attribution.ttclid,
        sc_click_id=attribution.scClickId,
        client_ip=client_ip,
        user_agent=user_agent,
        event_id_purchase=events.purchaseEventId,
        event_id_lead=events.leadEventId,
        sheet_sync_status="pending",
    )

    db.add(order)
    await db.flush()

    for i, item_in in enumerate(request.items):
        if item_in.productId not in PRODUCT_CATALOG:
            raise ValueError(f"المنتج غير موجود: {item_in.productId}")
        if item_in.offerId not in PRICE_RULES:
            raise ValueError(f"عرض السعر غير صحيح: {item_in.offerId}")
        product = PRODUCT_CATALOG[item_in.productId]
        price_rule = PRICE_RULES[item_in.offerId]
        item = OrderItem(
            order_id=order.id,
            product_id=item_in.productId,
            product_slug=product["slug"],
            product_name_ar=product["name_ar"],
            offer_id=item_in.offerId,
            quantity=int(price_rule["quantity"]),
            price_kwd=Decimal(str(price_rule["price_kwd"])),
            original_price_kwd=Decimal(str(price_rule["original_price_kwd"])),
            is_upsell=False,
            sort_order=i,
        )
        db.add(item)

    await db.commit()
    await db.refresh(order)

    return order


async def apply_upsell(
    db: AsyncSession,
    order_id: str,
    action: str,
    product_id: Optional[str],
) -> Order:
    result = await db.execute(select(Order).where(Order.id == UUID(order_id)))
    order = result.scalar_one_or_none()

    if not order:
        raise ValueError("الطلب غير موجود")

    if order.status != "pending_upsell":
        raise ValueError("لا يمكن تعديل هذا الطلب")

    if action == "accepted" and product_id:
        upsell_product = PRODUCT_CATALOG.get(product_id)
        if not upsell_product:
            raise ValueError("منتج الإضافة غير صحيح")

        upsell_price = Decimal("9")
        upsell_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            product_slug=upsell_product["slug"],
            product_name_ar=upsell_product["name_ar"],
            offer_id="upsell_9kwd",
            quantity=1,
            price_kwd=upsell_price,
            original_price_kwd=Decimal("19"),
            is_upsell=True,
            sort_order=99,
        )
        db.add(upsell_item)

        order.total_kwd = order.total_kwd + upsell_price
        order.upsell_status = "accepted"
    elif action == "skipped":
        order.upsell_status = "skipped"
    else:
        order.upsell_status = "timeout"

    order.updated_at = datetime.now(tz=timezone.utc)
    await db.commit()
    await db.refresh(order)

    return order


async def finalize_order(
    db: AsyncSession,
    order_id: str,
    purchase_event_id: Optional[str],
    browser_event_sent: bool,
) -> Order:
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == UUID(order_id))
    )
    order = result.scalar_one_or_none()

    if not order:
        raise ValueError("الطلب غير موجود")

    if order.status == "submitted":
        return order

    order.status = "submitted"
    order.submitted_at = datetime.now(tz=timezone.utc)
    order.updated_at = datetime.now(tz=timezone.utc)

    if purchase_event_id:
        order.event_id_purchase = purchase_event_id

    if order.upsell_status == "not_shown":
        order.upsell_status = "skipped"

    await db.commit()
    await db.refresh(order)

    return order


async def get_order(db: AsyncSession, order_id: str) -> Optional[Order]:
    from sqlalchemy.orm import selectinload
    try:
        result = await db.execute(
            select(Order).options(selectinload(Order.items)).where(Order.id == UUID(order_id))
        )
        return result.scalar_one_or_none()
    except Exception:
        return None
