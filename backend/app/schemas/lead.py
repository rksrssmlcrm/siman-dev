import re
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Keep in sync with frontend/lib/validation/lead.ts (leadPayloadSchema).
# Contract: docs/ARCHITECTURE.md section 3.

PHONE_E164_RE = re.compile(r"^\+7\d{10}$")


class LeadCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    phone: str
    message: str | None = Field(default=None, max_length=1000)
    consent: bool
    honeypot: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone_e164(cls, value: str) -> str:
        if not PHONE_E164_RE.match(value):
            msg = "Телефон должен быть в формате +7XXXXXXXXXX"
            raise ValueError(msg)
        return value

    @field_validator("consent")
    @classmethod
    def validate_consent(cls, value: bool) -> bool:
        if value is not True:
            msg = "Необходимо согласие на обработку данных"
            raise ValueError(msg)
        return value


class LeadCreateResponse(BaseModel):
    id: UUID
    status: str = "accepted"


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
