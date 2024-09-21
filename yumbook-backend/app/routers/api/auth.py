from typing import Any

from fastapi import APIRouter, status

from app.models.user import UserCreate
from app.services.user_service import UserService
from app.utils.deps import SessionDep
from app.utils.util import ErrorResponse, SuccessResponse, raise_http_exception

router = APIRouter()


@router.post(
    "/register",
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def register_user(session: SessionDep, user_in: UserCreate) -> Any:
    service = UserService(session)
    new_user = service.create_user(user_in)
    if not new_user:
        raise_http_exception(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "User registration failed. Please try again later.",
        )

    return SuccessResponse(detail="Signup successful. Please log in to continue.")
