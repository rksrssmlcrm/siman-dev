from datetime import UTC, datetime, timedelta

import structlog
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.models.lead import Lead

logger = structlog.get_logger(__name__)


async def purge_expired_leads(session: AsyncSession, settings: Settings) -> int:
    cutoff = datetime.now(UTC) - timedelta(days=settings.lead_retention_days)
    result = await session.execute(delete(Lead).where(Lead.created_at < cutoff))
    await session.commit()
    deleted = result.rowcount or 0
    logger.info(
        "leads_retention_purge",
        deleted=deleted,
        retention_days=settings.lead_retention_days,
    )
    return deleted


async def count_leads(session: AsyncSession) -> int:
    result = await session.scalar(select(func.count()).select_from(Lead))
    return int(result or 0)
