from functools import lru_cache

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.constants import Environment


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: Environment = Field(alias="ENVIRONMENT")
    database_url: str = Field(alias="DATABASE_URL")
    secret_key: str = Field(alias="SECRET_KEY", min_length=16)
    cors_origins: str = Field(alias="CORS_ORIGINS")

    lead_retention_days: int = Field(default=180, alias="LEAD_RETENTION_DAYS", ge=1)
    rate_limit_leads: str = Field(default="5/minute", alias="RATE_LIMIT_LEADS")

    telegram_bot_token: str | None = Field(default=None, alias="TELEGRAM_BOT_TOKEN")
    telegram_chat_id: str | None = Field(default=None, alias="TELEGRAM_CHAT_ID")

    smtp_host: str | None = Field(default=None, alias="SMTP_HOST")
    smtp_user: str | None = Field(default=None, alias="SMTP_USER")
    smtp_password: str | None = Field(default=None, alias="SMTP_PASSWORD")
    admin_email: str | None = Field(default=None, alias="ADMIN_EMAIL")

    admin_password_hash: str | None = Field(default=None, alias="ADMIN_PASSWORD_HASH")
    enable_admin: bool = Field(default=False, alias="ENABLE_ADMIN")

    project_name: str = Field(default="SimanDev", alias="PROJECT_NAME")
    lead_notifications: bool = Field(default=True, alias="LEAD_NOTIFICATIONS")

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_not_wildcard_in_prod(cls, value: str, info) -> str:
        env = info.data.get("environment")
        if env == Environment.PRODUCTION and "*" in value:
            msg = "CORS_ORIGINS must not contain '*' in production"
            raise ValueError(msg)
        return value

    @model_validator(mode="after")
    def validate_notification_channels(self) -> "Settings":
        if not self.lead_notifications:
            return self
        telegram_ok = bool(self.telegram_bot_token and self.telegram_chat_id)
        smtp_ok = bool(self.smtp_host and self.smtp_user and self.smtp_password)
        if not telegram_ok and not smtp_ok:
            msg = (
                "At least one notification channel is required: "
                "TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID or SMTP_HOST+SMTP_USER+SMTP_PASSWORD"
            )
            raise ValueError(msg)
        return self

    @model_validator(mode="after")
    def validate_admin_credentials(self) -> "Settings":
        if self.enable_admin:
            if not self.admin_email or not self.admin_password_hash:
                msg = "ENABLE_ADMIN=true requires ADMIN_EMAIL and ADMIN_PASSWORD_HASH"
                raise ValueError(msg)
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def telegram_enabled(self) -> bool:
        return bool(self.telegram_bot_token and self.telegram_chat_id)

    @property
    def smtp_enabled(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()


def reset_settings_cache() -> None:
    get_settings.cache_clear()
