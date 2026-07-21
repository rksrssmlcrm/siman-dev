import os

from argon2 import PasswordHasher

# Environment must be configured before importing application modules.
os.environ.setdefault("ENVIRONMENT", "local")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key-local-dev")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
os.environ.setdefault("TELEGRAM_BOT_TOKEN", "0000000000:TEST_TELEGRAM_TOKEN")
os.environ.setdefault("TELEGRAM_CHAT_ID", "123456789")
os.environ.setdefault("ENABLE_ADMIN", "true")
os.environ.setdefault("ADMIN_EMAIL", "admin@test.local")
os.environ.setdefault("RATE_LIMIT_LEADS", "5/minute")
os.environ.setdefault("ADMIN_PASSWORD_HASH", PasswordHasher().hash("test-password"))

from collections.abc import AsyncGenerator, Generator
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings, reset_settings_cache
from app.db import Base, dispose_db, get_engine, init_db
from app.main import create_app


@pytest.fixture(autouse=True)
def _reset_settings() -> Generator[None]:
    reset_settings_cache()
    yield
    reset_settings_cache()


@pytest.fixture(autouse=True)
async def _database() -> AsyncGenerator[None]:
    settings = get_settings()
    init_db(settings)
    engine = get_engine()
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
    await dispose_db()


@pytest.fixture(autouse=True)
def _mock_notifications() -> Generator[AsyncMock]:
    with patch(
        "app.api.leads.send_lead_notifications",
        new=AsyncMock(),
    ) as mocked:
        yield mocked


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
async def client(app) -> AsyncGenerator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def valid_payload() -> dict:
    return {
        "name": "Иван Тестов",
        "phone": "+79991234567",
        "message": "Нужен лендинг",
        "consent": True,
        "consent_text_version": "2026-07-21",
        "honeypot": "",
    }


@pytest.fixture
def admin_auth() -> tuple[str, str]:
    return ("admin@test.local", "test-password")
