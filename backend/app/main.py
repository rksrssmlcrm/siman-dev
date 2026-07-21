from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import __version__
from app.api.admin import router as admin_router
from app.api.leads import leads_router
from app.api.leads import router as health_router
from app.constants import Environment
from app.core.config import Settings, get_settings
from app.core.errors import (
    http_exception_handler,
    rate_limit_handler,
    validation_exception_handler,
)
from app.core.logging import configure_logging
from app.core.ratelimit import limiter
from app.db import dispose_db, init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    init_db(settings)
    yield
    await dispose_db()


def create_app(settings: Settings | None = None) -> FastAPI:
    cfg = settings or get_settings()
    configure_logging(cfg.environment.value)

    docs_url = "/docs" if cfg.environment != Environment.PRODUCTION else None
    redoc_url = "/redoc" if cfg.environment != Environment.PRODUCTION else None

    app = FastAPI(
        title="SimanDev API",
        version=__version__,
        lifespan=lifespan,
        docs_url=docs_url,
        redoc_url=redoc_url,
    )

    app.state.limiter = limiter
    limiter.reset()
    limiter._default_limits = [cfg.rate_limit_leads]  # noqa: SLF001
    app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cfg.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["*"],
    )
    app.add_middleware(SlowAPIMiddleware)

    app.include_router(health_router)
    app.include_router(leads_router)
    app.include_router(admin_router)

    return app


app = create_app()
