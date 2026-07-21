import smtplib
from datetime import UTC, datetime
from email.message import EmailMessage

import httpx
import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import LeadStatus
from app.core.config import Settings
from app.core.security import mask_phone
from app.models.lead import Lead

logger = structlog.get_logger(__name__)


async def create_lead(
    session: AsyncSession,
    *,
    payload_name: str,
    payload_phone: str,
    payload_message: str | None,
    source_page: str | None,
    user_agent_hash: str | None,
    is_spam: bool,
    consent_text_version: str,
) -> Lead:
    now = datetime.now(UTC)
    lead = Lead(
        name=payload_name,
        phone=payload_phone,
        message=payload_message,
        source_page=source_page,
        user_agent_hash=user_agent_hash,
        status=LeadStatus.SPAM.value if is_spam else LeadStatus.NEW.value,
        consent_given=True,
        consent_text_version=consent_text_version,
        consent_at=now,
    )
    session.add(lead)
    await session.commit()
    await session.refresh(lead)
    return lead


def build_notification_text(lead: Lead, project_name: str) -> str:
    lines = [
        f"Новая заявка — {project_name}",
        "",
        f"Имя: {lead.name}",
        f"Телефон: {lead.phone}",
    ]
    if lead.message:
        lines.extend(["", "Сообщение:", lead.message])
    if lead.source_page:
        lines.extend(["", f"Страница: {lead.source_page}"])
    lines.extend(["", f"ID заявки: {lead.id}"])
    return "\n".join(lines)


async def send_lead_notifications(settings: Settings, lead: Lead) -> None:
    if lead.status == LeadStatus.SPAM.value:
        return

    text = build_notification_text(lead, settings.project_name)
    masked = mask_phone(lead.phone)

    if settings.telegram_enabled:
        await _send_telegram(settings, text, lead.id, masked)

    if settings.smtp_enabled and settings.admin_email:
        await _send_email(settings, text, lead.id, masked)


async def _send_telegram(
    settings: Settings,
    text: str,
    lead_id,
    masked_phone: str,
) -> None:
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {"chat_id": settings.telegram_chat_id, "text": text}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
        logger.info("telegram_notification_sent", lead_id=str(lead_id), phone=masked_phone)
    except Exception:
        logger.exception("telegram_notification_failed", lead_id=str(lead_id), phone=masked_phone)


async def _send_email(
    settings: Settings,
    text: str,
    lead_id,
    masked_phone: str,
) -> None:
    message = EmailMessage()
    message["Subject"] = f"Новая заявка — {settings.project_name}"
    message["From"] = settings.smtp_user
    message["To"] = settings.admin_email
    message.set_content(text)

    try:
        with smtplib.SMTP(settings.smtp_host, 587, timeout=10) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
        logger.info("email_notification_sent", lead_id=str(lead_id), phone=masked_phone)
    except Exception:
        logger.exception("email_notification_failed", lead_id=str(lead_id), phone=masked_phone)
