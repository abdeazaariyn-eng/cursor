from __future__ import annotations

import uuid
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from app.api.routes import health, orders, tracking
from app.core.config import settings
from app.core.logging import get_logger, setup_logging

setup_logging()
logger = get_logger(__name__)


async def _run_migrations() -> None:
    from alembic import command
    from alembic.config import Config as AlembicConfig

    cfg = AlembicConfig("alembic.ini")
    import asyncio
    import os

    os.environ.setdefault("DATABASE_URL", settings.DATABASE_URL)

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, lambda: command.upgrade(cfg, "head"))


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("startup", env=settings.APP_ENV, host=settings.API_HOST, port=settings.API_PORT)

    if settings.RUN_MIGRATIONS_ON_START:
        try:
            logger.info("running_migrations")
            await _run_migrations()
            logger.info("migrations_complete")
        except Exception as exc:
            logger.error("migration_failed", error=str(exc))
            raise

    from app.db.session import engine
    logger.info("database_connected")

    yield

    from app.db.session import engine as db_engine
    await db_engine.dispose()
    logger.info("shutdown")


app = FastAPI(
    title="Mahdbaby API",
    description="مهد بيبي — Backend API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    max_age=86400,
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next: Any) -> Any:
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
    first_error = exc.errors()[0] if exc.errors() else {}
    message = str(first_error.get("msg", "بيانات غير صحيحة"))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "VALIDATION_ERROR", "message": message}},
    )

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    first_error = exc.errors()[0] if exc.errors() else {}
    message = str(first_error.get("msg", "بيانات غير صحيحة"))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "VALIDATION_ERROR", "message": message}},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    import traceback
    logger.error(
        "unhandled_exception",
        error=str(exc),
        path=str(request.url),
        traceback=traceback.format_exc(),
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": {"code": "SERVER_ERROR", "message": f"حدث خطأ: {str(exc)}"}},
    )


app.include_router(health.router)
app.include_router(orders.router)
app.include_router(tracking.router)
from app.api.routes import admin
app.include_router(admin.router)
