from __future__ import annotations

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "env": settings.APP_ENV}


@router.get("/")
async def root() -> dict[str, str]:
    return {"service": "mahdbaby-api", "status": "running", "env": settings.APP_ENV}
