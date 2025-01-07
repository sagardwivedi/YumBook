from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)


class UserRegister(UserBase):
    password: str = Field(min_length=8, max_length=40)


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    is_active: bool = True
    is_superuser: bool = False
    hashed_password: str


class UserPublic(UserBase):
    id: UUID


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None
