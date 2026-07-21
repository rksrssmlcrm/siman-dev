from typing import Any

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException


def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    errors = [
        {
            "field": ".".join(str(part) for part in err.get("loc", []) if part != "body"),
            "message": err.get("msg", "Invalid value"),
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={
            "type": "urn:simandev:validation-error",
            "title": "Validation failed",
            "status": 422,
            "errors": errors,
        },
        headers={"Content-Type": "application/problem+json"},
    )


def rate_limit_handler(_: Request, exc: RateLimitExceeded) -> JSONResponse:
    retry_after = getattr(exc, "retry_after", 60)
    return JSONResponse(
        status_code=429,
        content={
            "type": "urn:simandev:rate-limit",
            "title": "Too many requests",
            "status": 429,
            "detail": "Rate limit exceeded. Please try again later.",
        },
        headers={
            "Content-Type": "application/problem+json",
            "Retry-After": str(retry_after),
        },
    )


def http_exception_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, dict):
        content: dict[str, Any] = detail
    else:
        content = {
            "type": "about:blank",
            "title": str(detail),
            "status": exc.status_code,
        }
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        headers={"Content-Type": "application/problem+json"},
    )
