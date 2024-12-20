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
    avatar_path: str | None = Field(
        default=None, description="Path to user's avatar image"
    )
    full_name: str | None = Field(
        default=None, max_length=255, description="User's full name"
    )


class UserCreate(SQLModel):
    password: str = Field(min_length=8, max_length=40, description="User's password")
    username: str = Field(
        min_length=3,
        max_length=255,
        description="Unique username",
    )
    email: EmailStr = Field(max_length=255, description="User's email address")
    full_name: str | None = Field(
        default=None, max_length=255, description="User's full name"
    )


class UserUpdate(SQLModel):
    username: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    avatar_path: str | None = Field(default=None)
    full_name: str | None = Field(default=None, max_length=255)


class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str

    recipe: list[Recipe] = Relationship(back_populates="user", cascade_delete=True)
    comments: list[Comment] = Relationship(back_populates="user", cascade_delete=True)
    likes: list[Like] = Relationship(back_populates="user", cascade_delete=True)

    followers: list["Follow"] = Relationship(
        back_populates="followed",
        sa_relationship_kwargs={"foreign_keys": "[Follow.followed_id]"},
    )
    following: list["Follow"] = Relationship(
        back_populates="follower",
        sa_relationship_kwargs={"foreign_keys": "[Follow.follower_id]"},
    )


class Follow(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    follower_id: UUID = Field(foreign_key="user.id")
    followed_id: UUID = Field(foreign_key="user.id")

    follower: User = Relationship(
        back_populates="followers",
        sa_relationship_kwargs={"foreign_keys": "[Follow.follower_id]"},
    )
    followed: User = Relationship(
        back_populates="following",
        sa_relationship_kwargs={"foreign_keys": "[Follow.followed_id]"},
    )


class UserPublic(UserBase):
    id: UUID


class UserForRecipe(SQLModel):
    id: UUID
    avatar_path: str | None
    username: str


class RecipeWithUser(SQLModel):
    recipe: RecipePublic
    user: UserForRecipe
