from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.models.user import UserCreate
from app.services.user_service import UserService
from app.utils.auth import create_access_token
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
    new_user = service.create_user(user_in)

    if not new_user:
        raise_http_exception(
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
    user = service.authenticate(form.username, form.password)

    if not user:
        raise_http_exception(
            status.HTTP_400_BAD_REQUEST,
            "Incorrect email or password",
        )

    # Ensure user is authenticated and has a valid ID before issuing the token
    if user and hasattr(user, "id"):
        # Set the expiration time for the access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(user.id, access_token_expires)

        # Set the access token as an HTTP-only, secure cookie
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,  # Prevent JavaScript access to the cookie
            secure=True,  # Only send the cookie over HTTPS
            samesite="lax",  # Prevent CSRF attacks
        )

        return SuccessResponse(detail="Login successful")

    raise_http_exception(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Unexpected error",
    )
