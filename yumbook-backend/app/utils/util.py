from fastapi import HTTPException
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    detail: str


class SuccessResponse(BaseModel):
    detail: str


def raise_http_exception(status_code: int, detail: str) -> None:
    raise HTTPException(status_code=status_code, detail=detail)
