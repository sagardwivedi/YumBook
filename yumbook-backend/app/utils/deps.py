from collections.abc import Generator
from typing import Annotated, Any
from uuid import UUID

from fastapi import Depends, HTTPException, status
from jwt import InvalidTokenError, decode
from pydantic import ValidationError
from sqlmodel import Session

from app.config import settings
from app.database.session import engine
from app.models import TokenPayload, User
from app.utils.util import OAuth2PasswordBearerWithCookie

reusable_oauth2 = OAuth2PasswordBearerWithCookie(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator[Session, Any, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    id = UUID(token_data.sub)
    user = session.get(User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
