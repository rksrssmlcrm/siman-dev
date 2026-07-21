"""Add consent audit fields to leads."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "002_consent_audit"
down_revision: str | None = "001_initial"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "leads",
        sa.Column("consent_given", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.add_column(
        "leads",
        sa.Column(
            "consent_text_version",
            sa.String(length=32),
            nullable=False,
            server_default="legacy",
        ),
    )
    op.add_column(
        "leads",
        sa.Column(
            "consent_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.alter_column("leads", "consent_given", server_default=None)
    op.alter_column("leads", "consent_text_version", server_default=None)
    op.alter_column("leads", "consent_at", server_default=None)


def downgrade() -> None:
    op.drop_column("leads", "consent_at")
    op.drop_column("leads", "consent_text_version")
    op.drop_column("leads", "consent_given")
