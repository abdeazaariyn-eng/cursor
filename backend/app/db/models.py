from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    order_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_raw: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_domestic: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_e164: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_hash_meta_snap: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    phone_hash_tiktok: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending_upsell")
    upsell_status: Mapped[str] = mapped_column(String(30), nullable=False, default="not_shown")
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="KWD")

    subtotal_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    discount_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False, default=Decimal("0"))
    total_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)

    source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    landing_page: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    utm_source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    utm_medium: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    utm_campaign: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    utm_content: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    utm_term: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    fbp: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    fbc: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    ttp: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    ttclid: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    sc_click_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    client_ip: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    event_id_purchase: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    event_id_lead: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    sheet_sync_status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    sheet_sync_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    items: Mapped[list[OrderItem]] = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )
    tracking_events: Mapped[list[TrackingEvent]] = relationship(
        "TrackingEvent", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
    )
    product_id: Mapped[str] = mapped_column(String(100), nullable=False)
    product_slug: Mapped[str] = mapped_column(String(200), nullable=False)
    product_name_ar: Mapped[str] = mapped_column(String(500), nullable=False)
    offer_id: Mapped[str] = mapped_column(String(50), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    price_kwd: Mapped[Decimal] = mapped_column(Numeric(10, 3), nullable=False)
    original_price_kwd: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 3), nullable=True)
    is_upsell: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    order: Mapped[Order] = relationship("Order", back_populates="items")


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    order_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="SET NULL"),
        nullable=True,
    )
    event_name: Mapped[str] = mapped_column(String(100), nullable=False)
    event_id: Mapped[str] = mapped_column(String(100), nullable=False)
    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    payload: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    response: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    order: Mapped[Optional[Order]] = relationship("Order", back_populates="tracking_events")
