from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from app.models.recipe import Comment, Like, Recipe, RecipePublic


class UserBase(SQLModel):
    username: str = Field(
        unique=True,
        index=True,
        min_length=3,
        max_length=255,
        description="Unique username",
    )
    email: EmailStr = Field(
        unique=True, max_length=255, description="User's email address"
    )
    avatar_path: str = Field(default=None, description="Path to user's avatar image")
    full_name: str = Field(default=None, max_length=255, description="User's full name")


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40, description="User's password")


class UserUpdate(UserBase):
    username: str | None = Field(default=None, max_length=255)  # type:ignore
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str

    recipe: list[Recipe] = Relationship(back_populates="user", cascade_delete=True)
    comments: list[Comment] = Relationship(back_populates="user")
    likes: list[Like] = Relationship(back_populates="user")


class UserPublic(UserBase):
    id: UUID


class UserForRecipe(SQLModel):
    id: UUID
    avatar_path: str
    username: str


class RecipeWithUser(SQLModel):
    recipe: RecipePublic
    user: UserForRecipe
