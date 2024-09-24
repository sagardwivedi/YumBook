from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import status
from jwt import PyJWTError, decode, encode
from passlib.context import CryptContext

from app.config import settings
from app.models import TokenPayload
from app.utils import raise_http_exception

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
        """
        Create a JWT access token for a given subject (typically a user ID).
        """
        expire = datetime.now(UTC) + expires_delta
        to_encode = {"exp": expire, "sub": str(subject)}
        encoded_jwt = encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        return encoded_jwt

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify that a plaintext password matches a hashed password.
        """
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plaintext password using bcrypt.
        """
        return pwd_context.hash(password)

    @staticmethod
    def verify_access_token(token: str) -> str | None:
        """
        Verify and decode a JWT access token. Returns the subject (user ID) if valid, otherwise raises an exception.

        Args:
            token: The JWT token to be verified.

        Returns:
            The subject (typically a user ID) if the token is valid.

        Raises:
            HTTPException: If the token is invalid or expired.
        """
        try:
            payload = decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            token_data = TokenPayload(**payload)
            if token_data.sub is None:
                raise_http_exception(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                )
            return token_data.sub
        except PyJWTError:
            raise_http_exception(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
