import asyncio

import structlog

from app.core.config import get_settings, reset_settings_cache
from app.core.logging import configure_logging
from app.db import dispose_db, get_session, init_db
from app.services.retention import purge_expired_leads

logger = structlog.get_logger(__name__)


async def _run_retention() -> int:
    settings = get_settings()
    init_db(settings)
    try:
        async for session in get_session():
            return await purge_expired_leads(session, settings)
    finally:
        await dispose_db()
    return 0


def main() -> None:
    reset_settings_cache()
    settings = get_settings()
    configure_logging(settings.environment.value)
    deleted = asyncio.run(_run_retention())
    logger.info("retention_cli_complete", deleted=deleted)


if __name__ == "__main__":
    main()
