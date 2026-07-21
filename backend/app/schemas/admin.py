from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.constants import LeadStatus


class LeadItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    phone: str
    message: str | None
    created_at: datetime
    source_page: str | None
    status: LeadStatus


class LeadListResponse(BaseModel):
    items: list[LeadItem]
    total: int
    page: int
    page_size: int


class LeadStatusUpdate(BaseModel):
    status: LeadStatus = Field(description="new | processed | spam")


class RetentionResult(BaseModel):
    deleted: int
    retention_days: int
