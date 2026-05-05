"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    op.create_table(
        'orders',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True, nullable=False),
        sa.Column('order_number', sa.String(50), unique=True, nullable=False),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('phone_raw', sa.String(50), nullable=False),
        sa.Column('phone_domestic', sa.String(20), nullable=False),
        sa.Column('phone_e164', sa.String(20), nullable=False),
        sa.Column('phone_hash_meta_snap', sa.String(64), nullable=True),
        sa.Column('phone_hash_tiktok', sa.String(64), nullable=True),
        sa.Column('status', sa.String(30), nullable=False, server_default='pending_upsell'),
        sa.Column('upsell_status', sa.String(30), nullable=False, server_default='not_shown'),
        sa.Column('currency', sa.String(10), nullable=False, server_default='KWD'),
        sa.Column('subtotal_kwd', sa.Numeric(10, 3), nullable=False),
        sa.Column('discount_kwd', sa.Numeric(10, 3), nullable=False, server_default='0'),
        sa.Column('total_kwd', sa.Numeric(10, 3), nullable=False),
        sa.Column('source', sa.String(100), nullable=True),
        sa.Column('landing_page', sa.Text, nullable=True),
        sa.Column('utm_source', sa.String(100), nullable=True),
        sa.Column('utm_medium', sa.String(100), nullable=True),
        sa.Column('utm_campaign', sa.String(200), nullable=True),
        sa.Column('utm_content', sa.String(200), nullable=True),
        sa.Column('utm_term', sa.String(200), nullable=True),
        sa.Column('fbp', sa.String(200), nullable=True),
        sa.Column('fbc', sa.String(200), nullable=True),
        sa.Column('ttp', sa.String(200), nullable=True),
        sa.Column('ttclid', sa.String(200), nullable=True),
        sa.Column('sc_click_id', sa.String(200), nullable=True),
        sa.Column('client_ip', sa.String(50), nullable=True),
        sa.Column('user_agent', sa.Text, nullable=True),
        sa.Column('event_id_purchase', sa.String(100), nullable=True),
        sa.Column('event_id_lead', sa.String(100), nullable=True),
        sa.Column('sheet_sync_status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('sheet_sync_error', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True),
    )

    op.create_index('ix_orders_order_number', 'orders', ['order_number'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])
    op.create_index('ix_orders_status', 'orders', ['status'])
    op.create_index('ix_orders_phone_domestic', 'orders', ['phone_domestic'])

    op.create_table(
        'order_items',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True, nullable=False),
        sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(100), nullable=False),
        sa.Column('product_slug', sa.String(200), nullable=False),
        sa.Column('product_name_ar', sa.String(500), nullable=False),
        sa.Column('offer_id', sa.String(50), nullable=False),
        sa.Column('quantity', sa.Integer, nullable=False),
        sa.Column('price_kwd', sa.Numeric(10, 3), nullable=False),
        sa.Column('original_price_kwd', sa.Numeric(10, 3), nullable=True),
        sa.Column('is_upsell', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('sort_order', sa.Integer, nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_index('ix_order_items_order_id', 'order_items', ['order_id'])

    op.create_table(
        'tracking_events',
        sa.Column('id', UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True, nullable=False),
        sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='SET NULL'), nullable=True),
        sa.Column('event_name', sa.String(100), nullable=False),
        sa.Column('event_id', sa.String(100), nullable=False),
        sa.Column('platform', sa.String(20), nullable=False),
        sa.Column('payload', JSONB, nullable=True),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('response', JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_index('ix_tracking_events_order_id', 'tracking_events', ['order_id'])
    op.create_index('ix_tracking_events_event_id', 'tracking_events', ['event_id'])


def downgrade() -> None:
    op.drop_table('tracking_events')
    op.drop_table('order_items')
    op.drop_table('orders')
