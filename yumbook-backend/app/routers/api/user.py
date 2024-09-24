from typing import Any

from fastapi import APIRouter

from app.models import UserRead
from app.utils import CurrentUser, ErrorResponse

router = APIRouter()


@router.get(
    "/me",
    response_model=UserRead,
    responses={
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def read_user(current: CurrentUser) -> Any:
    return current
