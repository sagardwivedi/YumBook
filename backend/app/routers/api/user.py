from typing import Any

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.models import UserPublic, UserRead
from app.models.user import UserUpdate
from app.services import UserService
from app.utils import CurrentUser, ErrorResponse, SessionDep
from app.utils.util import SuccessResponse, SuccessResponseWithData

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Such User",
        )

    return user


@router.post("/me")
def update_user(data: UserUpdate, session: SessionDep, current_user: CurrentUser):
    service = UserService(session)
    updated_user = service.update_user(current_user, data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update profile",
        )
    return updated_user


@router.post(
    "/profile-image",
    responses={
        200: {"model": SuccessResponseWithData},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def upload_profile_image(
    file: UploadFile, current_user: CurrentUser, session: SessionDep
) -> SuccessResponseWithData:
    """Upload a new profile image for the user."""
    service = UserService(session)
    return service.upload_profile_image(file, current_user)


@router.put(
    "/profile-image",
    responses={
        200: {"model": SuccessResponseWithData},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def update_profile_image(
    file: UploadFile, current_user: CurrentUser, session: SessionDep
) -> SuccessResponseWithData:
    """Update an existing profile image for the user."""
    service = UserService(session)
    return service.update_profile_image(file, current_user)


@router.delete(
    "/profile-image",
    responses={
        200: {"model": SuccessResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def delete_profile_image(
    current_user: CurrentUser, session: SessionDep
) -> SuccessResponse:
    """Delete the user's profile image."""
    service = UserService(session)
    service.delete_profile_image(current_user)
    return SuccessResponse(detail="Profile image deleted successfully.")
