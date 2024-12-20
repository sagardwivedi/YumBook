from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status
from sqlmodel import select

from app.models import UserPublic, UserUpdate
from app.models.user import Follow, User
from app.services import UserService
from app.utils import (
    CurrentUser,
    ErrorResponse,
    SessionDep,
    SuccessResponse,
    SuccessResponseWithData,
)

router = APIRouter()


def get_user_service(db: SessionDep) -> UserService:
    return UserService(db)


@router.get(
    "/me",
    response_model=UserPublic,
    responses={
        200: {"model": UserPublic},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def get_current_user(current_user: CurrentUser):
    """
    Get the currently authenticated user's profile.

    Args:
        current_user: The currently authenticated user

    Returns:
        UserPublic: The user's public profile
    """
    return current_user


@router.get(
    "/{username}",
    response_model=UserPublic,
    responses={
        200: {"model": UserPublic},
        404: {"model": ErrorResponse},
    },
)
def get_user_by_username(
    username: str,
    service: UserService = Depends(get_user_service),
):
    """
    Get a user's public profile by their username.

    Args:
        username: The username to look up
        session: Database session dependency

    Returns:
        UserPublic: The user's public profile

    Raises:
        HTTPException: If user is not found
    """
    user = service.get_user_by_username(username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.patch(
    "/me",
    response_model=UserPublic,
    responses={
        200: {"model": UserPublic},
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def update_current_user(
    data: UserUpdate,
    current_user: CurrentUser,
    service: UserService = Depends(get_user_service),
):
    """
    Update the current user's profile information.

    Args:
        data: The user data to update
        current_user: The currently authenticated user
        session: Database session dependency

    Returns:
        UserPublic: The updated user profile

    Raises:
        HTTPException: If update fails
    """
    try:
        updated_user = service.update_user(current_user, data)
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {str(e)}",
        )


@router.post(
    "/profile-image",
    response_model=SuccessResponseWithData,
    responses={
        200: {"model": SuccessResponseWithData},
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def upload_profile_image(
    file: UploadFile,
    current_user: CurrentUser,
    service: UserService = Depends(get_user_service),
) -> SuccessResponseWithData:
    """
    Upload a new profile image for the current user.

    Args:
        file: The image file to upload
        current_user: The currently authenticated user
        session: Database session dependency

    Returns:
        SuccessResponseWithData: Response with the path to the uploaded image

    Raises:
        HTTPException: If upload fails
    """
    return service.upload_profile_image(file, current_user)


@router.put(
    "/profile-image",
    response_model=SuccessResponseWithData,
    responses={
        200: {"model": SuccessResponseWithData},
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def update_profile_image(
    file: UploadFile,
    current_user: CurrentUser,
    service: UserService = Depends(get_user_service),
) -> SuccessResponseWithData:
    """
    Update the current user's existing profile image.

    Args:
        file: The new image file
        current_user: The currently authenticated user
        session: Database session dependency

    Returns:
        SuccessResponseWithData: Response with the path to the updated image

    Raises:
        HTTPException: If update fails
    """
    return service.update_profile_image(file, current_user)


@router.delete(
    "/profile-image",
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def delete_profile_image(
    current_user: CurrentUser, service: UserService = Depends(get_user_service)
) -> SuccessResponse:
    """
    Delete the current user's profile image.

    Args:
        current_user: The currently authenticated user
        session: Database session dependency

    Returns:
        SuccessResponse: Success message

    Raises:
        HTTPException: If deletion fails
    """
    service.delete_profile_image(current_user)
    return SuccessResponse(detail="Profile image deleted successfully")


@router.post("/follow", response_model=UserPublic)
async def follow_user(
    follow_request: Annotated[UUID, Form()],
    user: CurrentUser,
    session: SessionDep,
):
    """Follow a user"""
    followed_user = session.get(User, follow_request)
    if not followed_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == followed_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    # Check if the follow relationship already exists
    existing_follow = session.exec(
        select(Follow).where(
            Follow.follower_id == user.id, Follow.followed_id == followed_user.id
        )
    ).first()
    if existing_follow:
        raise HTTPException(status_code=400, detail="Already following this user")

    # Create follow relationship
    follow = Follow(follower_id=user.id, followed_id=followed_user.id)
    session.add(follow)
    session.commit()

    return followed_user
