from datetime import datetime
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Base class for User
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    profile_image_url: str | None = Field(default=None, max_length=255)
    username: str = Field(unique=True, min_length=3, max_length=10)


class UserRegister(SQLModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=10)
    full_name: str | None = Field(default=None, max_length=255)
    password: str = Field(min_length=8, max_length=40)


class UserPublic(SQLModel):
    id: UUID
    full_name: str | None
    profile_image_url: str | None


class UserPrivate(UserPublic):
    email: EmailStr
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime


class Follow(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    follower_id: UUID = Field(foreign_key="user.id")
    followed_id: UUID = Field(foreign_key="user.id")

    follower: "User" = Relationship(
        back_populates="followers",
        sa_relationship_kwargs={"foreign_keys": "[Follow.follower_id]"},
    )
    followed: "User" = Relationship(
        back_populates="following",
        sa_relationship_kwargs={"foreign_keys": "[Follow.followed_id]"},
    )


# Main User model (with database table)
class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)
    is_active: bool = True
    is_superuser: bool = False

    # Followed and Following relationships (many-to-many)
    followers: list[Follow] = Relationship(
        back_populates="followed",
        sa_relationship_kwargs={"foreign_keys": "[Follow.followed_id]"},
    )
    following: list[Follow] = Relationship(
        back_populates="follower",
        sa_relationship_kwargs={"foreign_keys": "[Follow.follower_id]"},
    )

    # Recipes posted by the user
    recipes: list["Recipe"] = Relationship(back_populates="owner")

    # Reactions given by the user to recipes (likes)
    reactions: list["RecipeReaction"] = Relationship(back_populates="user")

    # Comments made by the user
    comments: list["Comment"] = Relationship(back_populates="user")


# Recipe model (for posting recipes)
class Recipe(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=500)
    ingredients: str | None = Field(default=None, max_length=500)
    preparation_steps: str | None = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)

    # Foreign key to the user who posted the recipe
    owner_id: UUID = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="recipes")

    # Reactions to the recipe (likes)
    reactions: list["RecipeReaction"] = Relationship(back_populates="recipe")

    # Relationship with RecipeImage (one-to-many)
    images: list["RecipeImage"] = Relationship(back_populates="recipe")

    # Comments on the recipe
    comments: list["Comment"] = Relationship(back_populates="recipe")


# Recipe Image model (for storing multiple images)
class RecipeImage(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    image_url: str = Field(max_length=255)  # URL to the image
    recipe_id: UUID = Field(foreign_key="recipe.id")
    recipe: "Recipe" = Relationship(back_populates="images")


# Recipe Reaction model (for likes)
class RecipeReaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    recipe_id: UUID = Field(foreign_key="recipe.id")
    created_at: datetime = Field(default_factory=datetime.now)

    # Relationships with the User and Recipe
    user: "User" = Relationship(back_populates="reactions")
    recipe: "Recipe" = Relationship(back_populates="reactions")


# Comment Model (for user comments on recipes)
class Comment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    content: str = Field(max_length=1000)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)

    # Foreign keys to the User and Recipe models
    user_id: UUID = Field(foreign_key="user.id")
    recipe_id: UUID = Field(foreign_key="recipe.id")

    # Relationships to User and Recipe
    user: "User" = Relationship(back_populates="comments")
    recipe: "Recipe" = Relationship(back_populates="comments")


class TokenPayload(SQLModel):
    sub: str | None = None


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
