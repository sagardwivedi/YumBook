from typing import Any

from fastapi import APIRouter, status

from app.models import UserPublic, UserRead
from app.models.user import UserUpdate
from app.services import UserService
from app.utils import CurrentUser, ErrorResponse, SessionDep
from app.utils.util import raise_http_exception

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
def read_me(current: CurrentUser) -> Any:
    return current


@router.get(
    "/{username}",
    response_model=UserPublic,
    responses={
        200: {"model": UserPublic},
        404: {"model": ErrorResponse},
    },
)
def read_other_user(username: str, session: SessionDep) -> Any:
    service = UserService(session)
    user = service.get_user_by_username(username)

    if user is None:
        raise_http_exception(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Such User",
        )

    return user


@router.post("/me")
def update_profile(data: UserUpdate, session: SessionDep):
    pass
