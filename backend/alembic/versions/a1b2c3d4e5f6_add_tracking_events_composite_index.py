"""Add composite index on tracking_events(event_name, created_at)

Revision ID: a1b2c3d4e5f6
Revises: dbdaee2ffe85
Create Date: 2026-09-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'dbdaee2ffe85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Speeds up admin metrics queries that filter tracking_events by
    # event_name and a created_at date range (was doing a full table scan).
    op.create_index(
        'ix_tracking_events_event_name_created_at',
        'tracking_events',
        ['event_name', 'created_at'],
    )


def downgrade() -> None:
    op.drop_index('ix_tracking_events_event_name_created_at', table_name='tracking_events')
