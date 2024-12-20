from datetime import timedelta
from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from app.config import settings
from app.models import UserCreate
from app.services import AuthService, UserService
from app.utils import (
    ErrorResponse,
    SessionDep,
    SuccessResponse,
    SuccessResponseWithData,
)

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
    """
    Register a new user in the system.

    Args:
        session: The database session dependency.
        user_in: UserCreate model containing user details.

    Returns:
        SuccessResponse indicating successful registration.

    Raises:
        HTTPException: If user registration fails.
    """
    service = UserService(session)

    if not service.create_user(user_in):
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "User registration failed. Please try again later.",
        )

    return SuccessResponse(detail="Signup successful. Please log in to continue.")


@router.post(
    "/login/access-token",
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def login_user(
    response: Response,
    session: SessionDep,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Any:
    """
    Authenticate a user and issue an access token.

    Args:
        response: The response object to set cookies.
        session: The database session dependency.
        form: OAuth2PasswordRequestForm containing username and password.

    Returns:
        SuccessResponse indicating successful login.

    Raises:
        HTTPException: If authentication fails or if the user ID is missing.
    """
    service = UserService(session)
    auth_service = AuthService()

    user = service.authenticate(form.username, form.password)

    if not user:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Incorrect email or password",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(user.id, access_token_expires)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,  # Prevent JavaScript access to the cookie
        secure=True,  # Only send the cookie over HTTPS
        samesite="lax",  # Prevent CSRF attacks
    )
    return SuccessResponse(detail="Login successful")


@router.post(
    "/logout",
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        500: {"model": ErrorResponse},
    },
)
def logout_user(response: Response) -> Any:
    """
    Logout a user by clearing the access token cookie.
    """
    response.delete_cookie("access_token")
    return SuccessResponse(detail="Logout successful")


class ForgotPasswordData(BaseModel):
    email: EmailStr


@router.post(
    "/forgot-password",
    response_model=SuccessResponseWithData,
    responses={
        200: {"model": SuccessResponseWithData},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def forgot_password(
    data: Annotated[ForgotPasswordData, Form()], session: SessionDep
) -> Any:
    """
    Handle a forgot password request by generating and returning a reset token.
    """
    service = UserService(session)
    auth_service = AuthService()

    user = service.get_user_by_email(data.email)

    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "User with this email does not exist",
        )

    reset_token = auth_service.create_access_token(user.id, timedelta(minutes=15))

    return SuccessResponseWithData(
        detail="Password reset token generated",
        data={"reset_token": reset_token},
    )


class ResetPasswordData(BaseModel):
    token: str
    new_password: str


@router.post(
    "/reset-password",
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def reset_password(
    data: Annotated[ResetPasswordData, Form()], session: SessionDep
) -> Any:
    """
    Reset the user's password using a valid reset token.
    """
    auth_service = AuthService()
    user_service = UserService(session)

    user_id = auth_service.verify_access_token(data.token)
    if not user_id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Invalid or expired reset token",
        )

    user = user_service.get_user_by_id(UUID(user_id))

    if not user:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "User not found or invalid token",
        )

    user_service.update_password(user, data.new_password)
    return SuccessResponse(detail="Password has been successfully updated.")
