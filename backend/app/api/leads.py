import structlog
from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app import __version__
from app.core.config import Settings, get_settings
from app.core.ratelimit import limiter
from app.core.security import hash_user_agent, mask_phone
from app.db import get_engine, get_session
from app.schemas.lead import HealthResponse, LeadCreateRequest, LeadCreateResponse
from app.services.leads import create_lead, send_lead_notifications

logger = structlog.get_logger(__name__)
router = APIRouter(tags=["health"])
leads_router = APIRouter(prefix="/api", tags=["leads"])


@router.get("/api/health", response_model=HealthResponse)
async def health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    engine = get_engine()
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))

    return HealthResponse(
        status="ok",
        version=__version__,
        environment=settings.environment.value,
    )


def _lead_rate_limit() -> str:
    return get_settings().rate_limit_leads


@leads_router.post(
    "/leads",
    response_model=LeadCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit(_lead_rate_limit)
async def create_lead_endpoint(
    request: Request,
    payload: LeadCreateRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> LeadCreateResponse:
    is_spam = bool(payload.honeypot and payload.honeypot.strip())
    user_agent_hash = hash_user_agent(request.headers.get("user-agent"))
    source_page = request.headers.get("referer")

    lead = await create_lead(
        session,
        payload_name=payload.name,
        payload_phone=payload.phone,
        payload_message=payload.message,
        source_page=source_page,
        user_agent_hash=user_agent_hash,
        is_spam=is_spam,
        consent_text_version=payload.consent_text_version,
    )

    logger.info(
        "lead_created",
        lead_id=str(lead.id),
        phone=mask_phone(lead.phone),
        spam=is_spam,
    )

    if not is_spam:
        background_tasks.add_task(send_lead_notifications, settings, lead)

    return LeadCreateResponse(id=lead.id, status="accepted")
