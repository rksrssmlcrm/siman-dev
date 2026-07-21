#!/bin/sh
set -e

echo "Waiting for database..."
/app/.venv/bin/python - <<'PY'
import asyncio
import os
import sys
import time

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


async def wait() -> None:
    url = os.environ["DATABASE_URL"]
    for attempt in range(30):
        try:
            engine = create_async_engine(url)
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            await engine.dispose()
            print("Database is ready.")
            return
        except Exception as exc:
            print(f"  attempt {attempt + 1}/30: {exc}")
            time.sleep(2)
    print("Database not ready after 60 s.", file=sys.stderr)
    sys.exit(1)


asyncio.run(wait())
PY

echo "Running migrations..."
/app/.venv/bin/alembic upgrade head

echo "Starting uvicorn..."
exec /app/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
