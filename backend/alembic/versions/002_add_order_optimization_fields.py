"""Add order optimization fields - COD sync, location, order status

Revision ID: 002
Revises: dbdaee2ffe85
Create Date: 2026-09-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '002'
down_revision: Union[str, None] = 'dbdaee2ffe85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add customer location fields to orders
    op.add_column('orders', sa.Column('country', sa.String(50), nullable=True))
    op.add_column('orders', sa.Column('city', sa.String(100), nullable=True))
    op.add_column('orders', sa.Column('area', sa.String(100), nullable=True))
    op.add_column('orders', sa.Column('address', sa.Text, nullable=True))
    op.add_column('orders', sa.Column('notes', sa.Text, nullable=True))
    
    # Add order fulfillment status
    op.add_column('orders', sa.Column('order_status', sa.String(30), nullable=False, server_default='new'))
    
    # Add COD sync fields
    op.add_column('orders', sa.Column('cod_sync_status', sa.String(30), nullable=False, server_default='pending'))
    op.add_column('orders', sa.Column('cod_order_id', sa.String(100), nullable=True))
    op.add_column('orders', sa.Column('cod_tracking_number', sa.String(100), nullable=True))
    op.add_column('orders', sa.Column('cod_last_sync', sa.DateTime(timezone=True), nullable=True))
    op.add_column('orders', sa.Column('cod_sync_error', sa.Text, nullable=True))
    
    # Create index for order_status and cod_sync_status for faster queries
    op.create_index('ix_orders_order_status', 'orders', ['order_status'])
    op.create_index('ix_orders_cod_sync_status', 'orders', ['cod_sync_status'])
    
    # Add SKU field to order_items
    op.add_column('order_items', sa.Column('sku', sa.String(50), nullable=True))


def downgrade() -> None:
    # Remove indices
    op.drop_index('ix_orders_cod_sync_status', table_name='orders')
    op.drop_index('ix_orders_order_status', table_name='orders')
    
    # Remove columns from orders
    op.drop_column('orders', 'cod_sync_error')
    op.drop_column('orders', 'cod_last_sync')
    op.drop_column('orders', 'cod_tracking_number')
    op.drop_column('orders', 'cod_order_id')
    op.drop_column('orders', 'cod_sync_status')
    op.drop_column('orders', 'order_status')
    op.drop_column('orders', 'notes')
    op.drop_column('orders', 'address')
    op.drop_column('orders', 'area')
    op.drop_column('orders', 'city')
    op.drop_column('orders', 'country')
    
    # Remove SKU from order_items
    op.drop_column('order_items', 'sku')
