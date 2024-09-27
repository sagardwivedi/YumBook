from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(..., index=True, unique=True)
    profile_picture: str | None = Field(default=None)


class UserCreate(UserBase):
    password: str  # Password field for user creation


class UserUpdate(SQLModel):
    username: str | None = None
    profile_picture: str | None = None


class UserRead(UserBase):
    id: UUID  # Include ID for read operations
    email: str  # Include email for internal read operations


class UserPublic(UserBase):
    id: UUID  # Exclude email for public profile view


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)  # UUID primary key
    password_hash: str  # Store hashed password
    email: str = Field(..., index=True, unique=True)
    created_at: datetime = Field(default_factory=datetime.now)
