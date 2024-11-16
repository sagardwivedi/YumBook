from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


# Base class for Recipe model, containing common fields
class RecipeBase(SQLModel):
    # Name of the recipe, indexed and unique, with length constraints
    name: str = Field(index=True, unique=True, min_length=3, max_length=255)
    # Description of the recipe, with length constraints
    description: str = Field(min_length=10, max_length=1000)
    # Instructions for the recipe, stored as a JSON list
    instructions: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    # Cooking time in minutes, must be non-negative
    cooking_time: int = Field(ge=0)
    # Preparation time in minutes, must be non-negative
    preparation_time: int = Field(ge=0)
    # Difficulty level of the recipe
    difficulty: str
    # Number of servings, must be greater than 0
    servings: int = Field(gt=0)
    # Cuisine of the recipe, indexed, with length constraints
    cuisine: str = Field(index=True, min_length=1, max_length=100)
    # Dietary restrictions for the recipe, stored as a JSON list
    dietary_restrictions: list[str] = Field(
        default_factory=list, sa_column=Column(JSON)
    )
    # Tags for the recipe, stored as a JSON list
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    # Total number of likes for the recipe
    total_liked: int = Field(default=0, ge=0)


# Recipe model, inheriting from RecipeBase and adding additional fields
class Recipe(RecipeBase, table=True):
    # Unique identifier for the recipe
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # Timestamp when the recipe was created
    created_at: datetime = Field(default_factory=datetime.now)

    # URL of the recipe's image
    image_url: str

    # Foreign key relationship with the User model
    user_id: UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="recipe")
    comments: list["Comment"] = Relationship(back_populates="recipe")
    likes: list["Like"] = Relationship(back_populates="recipe")


# Comment model for the Recipe
class Comment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    content: str = Field(min_length=1, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.now)

    recipe_id: UUID = Field(foreign_key="recipe.id")
    recipe: "Recipe" = Relationship(back_populates="comments")
    user_id: UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="comments")


# Like model for the Recipe
class Like(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)

    recipe_id: UUID = Field(foreign_key="recipe.id")
    recipe: "Recipe" = Relationship(back_populates="likes")
    user_id: UUID = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="likes")


# Input model for creating a new recipe
class RecipeCreate(SQLModel):
    # Fields shared with RecipeBase
    cuisine: str
    instructions: list[str]
    servings: int
    name: str
    cooking_time: int
    dietary_restrictions: list[str]
    preparation_time: int
    tags: list[str]
    description: str
    difficulty: str


class LikePublic(SQLModel):
    user_id: UUID


# Public model for the Recipe, containing only the necessary fields
class RecipePublic(RecipeBase):
    id: UUID
    created_at: datetime
    image_url: str
    likes: list[LikePublic]


# Model for trending recipes, containing only the necessary fields
class RecipeTrending(SQLModel):
    id: UUID
    image_url: str
    name: str
    username: str
