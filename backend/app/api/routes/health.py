from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "env": settings.APP_ENV}


@router.get("/health/db")
async def db_health_check(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    """Verify the database connection is alive. Returns 503 if the DB is unreachable."""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ok", "db": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "error", "db": "unreachable", "detail": str(exc)},
        ) from exc


@router.get("/")
async def root() -> dict[str, str]:
    return {"service": "mahdbaby-api", "status": "running", "env": settings.APP_ENV}
