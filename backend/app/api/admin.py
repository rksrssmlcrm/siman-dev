from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.db import get_session
from app.schemas.admin import LeadItem, LeadListResponse, LeadStatusUpdate, RetentionResult
from app.services.admin import list_leads, require_admin, update_lead_status
from app.services.retention import purge_expired_leads

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/leads", response_model=LeadListResponse)
async def get_leads(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    _: str = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> LeadListResponse:
    items, total = await list_leads(session, page=page, page_size=page_size)
    return LeadListResponse(
        items=[LeadItem.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.patch("/leads/{lead_id}", response_model=LeadItem)
async def patch_lead_status(
    lead_id: UUID,
    payload: LeadStatusUpdate,
    _: str = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> LeadItem:
    lead = await update_lead_status(session, lead_id, payload.status)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"type": "about:blank", "title": "Lead not found", "status": 404},
        )
    return LeadItem.model_validate(lead)


@router.post("/retention/purge", response_model=RetentionResult)
async def purge_leads(
    _: str = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> RetentionResult:
    deleted = await purge_expired_leads(session, settings)
    return RetentionResult(deleted=deleted, retention_days=settings.lead_retention_days)
