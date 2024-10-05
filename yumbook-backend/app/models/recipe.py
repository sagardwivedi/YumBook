from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.models.ingredients import Ingredient


class RecipeBase(SQLModel):
    name: str = Field(..., index=True, unique=True, min_length=3, max_length=255)
    description: str = Field(..., nullable=False, min_length=10, max_length=1000)
    instructions: str = Field(..., nullable=False, min_length=10, max_length=1000)
    cooking_time: int = Field(..., ge=0)  # Cooking time in minutes
    preparation_time: int = Field(..., ge=0)  # Preparation time in minutes
    servings: int = Field(..., gt=0)  # Number of servings
    cuisine: str = Field(..., index=True, min_length=1, max_length=100)
    dietary_restrictions: str | None = Field(default=None, max_length=255)
    image_url: str | None = Field(default=None)  # URL to the recipe image
    tags: list[str] | None = Field(default=[])  # List of tags
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)


class Recipe(RecipeBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Relationship with RecipeIngredient
    ingredients: list["RecipeIngredient"] = Relationship(back_populates="recipe")


class RecipeIngredientBase(SQLModel):
    recipe_id: UUID = Field(foreign_key="recipe.id")
    ingredient_id: UUID = Field(foreign_key="ingredient.id")
    quantity: str = Field(..., max_length=50, min_length=1)
    unit: str = Field(..., min_length=1, max_length=50)

    class Config:
        # Enforce that both fields must be set
        schema_extra = {"example": {"quantity": "2", "unit": "cups"}}


class RecipeIngredient(RecipeIngredientBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Relationships
    recipe: Recipe = Relationship(back_populates="ingredients")
    ingredient: Ingredient = Relationship(back_populates="recipes")
