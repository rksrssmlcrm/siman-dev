from pydantic import BaseModel


class ValidationErrorItem(BaseModel):
    field: str
    message: str


class ProblemDetail(BaseModel):
    type: str = "about:blank"
    title: str
    status: int
    detail: str | None = None
    errors: list[ValidationErrorItem] | None = None
