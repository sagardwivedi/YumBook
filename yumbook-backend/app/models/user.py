from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(..., index=True, unique=True)
    email: str = Field(..., index=True, unique=True)
    profile_picture: str | None = None


class UserCreate(UserBase):
    password: str  # Password field for user creation


class UserUpdate(SQLModel):
    username: str | None = None
    email: str | None = None
    profile_picture: str | None = None


class UserPasswordUpdate(SQLModel):
    password: str  # Field for updating the password


class UserRead(UserBase):
    id: UUID  # Include ID for read operations


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)  # UUID primary key
    password_hash: str  # Store hashed password
    created_at: datetime = Field(default_factory=datetime.now)
