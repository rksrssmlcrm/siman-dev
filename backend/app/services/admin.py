from uuid import UUID

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import LeadStatus
from app.core.config import Settings, get_settings
from app.models.lead import Lead

security = HTTPBasic(auto_error=False)
_password_hasher = PasswordHasher()


def verify_password(password: str, password_hash: str) -> bool:
    try:
        _password_hasher.verify(password_hash, password)
        return True
    except (VerifyMismatchError, ValueError):
        return False


def hash_password(password: str) -> str:
    """Utility for generating ADMIN_PASSWORD_HASH (not used at runtime)."""
    return _password_hasher.hash(password)


async def require_admin(
    credentials: HTTPBasicCredentials | None = Depends(security),
    settings: Settings = Depends(get_settings),
) -> str:
    if not settings.enable_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"type": "about:blank", "title": "Not found", "status": 404},
        )

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "about:blank", "title": "Unauthorized", "status": 401},
            headers={"WWW-Authenticate": "Basic"},
        )

    if credentials.username != settings.admin_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "about:blank", "title": "Unauthorized", "status": 401},
            headers={"WWW-Authenticate": "Basic"},
        )

    if not settings.admin_password_hash or not verify_password(
        credentials.password,
        settings.admin_password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "about:blank", "title": "Unauthorized", "status": 401},
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username


async def list_leads(
    session: AsyncSession,
    *,
    page: int,
    page_size: int,
) -> tuple[list[Lead], int]:
    total = await session.scalar(select(func.count()).select_from(Lead))
    offset = (page - 1) * page_size
    result = await session.execute(
        select(Lead).order_by(Lead.created_at.desc()).offset(offset).limit(page_size)
    )
    return list(result.scalars().all()), int(total or 0)


async def update_lead_status(
    session: AsyncSession,
    lead_id: UUID,
    status_value: LeadStatus,
) -> Lead | None:
    lead = await session.get(Lead, lead_id)
    if lead is None:
        return None
    lead.status = status_value.value
    await session.commit()
    await session.refresh(lead)
    return lead
