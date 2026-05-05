from __future__ import annotations

import json
from functools import lru_cache
from typing import Any, List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_ENV: str = "development"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    PUBLIC_API_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"

    DATABASE_URL: str = "postgresql+asyncpg://mahdbaby:mahdbaby%40@localhost:5432/mahdbaby"
    RUN_MIGRATIONS_ON_START: bool = True

    # Stored as raw string to avoid pydantic_settings JSON pre-parsing issues
    _cors_origins_raw: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    CORS_ORIGINS_STR: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")

    GOOGLE_SHEETS_WEBHOOK_URL: str = ""
    GOOGLE_SHEETS_WEBHOOK_SECRET: str = ""

    META_PIXEL_ID: str = ""
    META_ACCESS_TOKEN: str = ""
    META_TEST_EVENT_CODE: str = ""

    TIKTOK_PIXEL_CODE: str = ""
    TIKTOK_ACCESS_TOKEN: str = ""

    SNAP_PIXEL_ID: str = ""
    SNAP_ACCESS_TOKEN: str = ""

    TRACKING_ENABLED: bool = True
    TRACKING_TEST_MODE: bool = False

    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""
    ALLOWED_COUNTRY: str = "KW"
    WHITELISTED_PHONE: str = "0501020304"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def parse_database_url(cls, v: object) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgresql://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
            return v
        return str(v)

    @field_validator("CORS_ORIGINS_STR", mode="before")
    @classmethod
    def parse_cors_origins_str(cls, v: Any) -> str:
        if isinstance(v, list):
            return ",".join(v)
        if isinstance(v, str):
            return v
        return "http://localhost:3000"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw = self.CORS_ORIGINS_STR or "http://localhost:3000"
        raw = raw.strip()
        if not raw:
            return ["http://localhost:3000"]
        if raw.startswith("["):
            try:
                return json.loads(raw)
            except Exception:
                pass
        return [o.strip() for o in raw.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def meta_capi_enabled(self) -> bool:
        return self.TRACKING_ENABLED and bool(self.META_PIXEL_ID) and bool(self.META_ACCESS_TOKEN)

    @property
    def tiktok_capi_enabled(self) -> bool:
        return self.TRACKING_ENABLED and bool(self.TIKTOK_PIXEL_CODE) and bool(self.TIKTOK_ACCESS_TOKEN)

    @property
    def snap_capi_enabled(self) -> bool:
        return self.TRACKING_ENABLED and bool(self.SNAP_PIXEL_ID) and bool(self.SNAP_ACCESS_TOKEN)

    @property
    def sheets_enabled(self) -> bool:
        return bool(self.GOOGLE_SHEETS_WEBHOOK_URL) and bool(self.GOOGLE_SHEETS_WEBHOOK_SECRET)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
