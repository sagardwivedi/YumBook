from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

from app.models.user import User


class RecipeBase(SQLModel):
    name: str = Field(index=True, unique=True, min_length=3, max_length=255)
    description: str = Field(min_length=10, max_length=1000)
    instructions: str = Field(min_length=10, max_length=1000)
    cooking_time: int = Field(ge=0)
    preparation_time: int = Field(ge=0)
    servings: int = Field(gt=0)
    cuisine: str = Field(index=True, min_length=1, max_length=100)
    dietary_restrictions: str | None = Field(default=None, max_length=255)
    image_url: str | None = None
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))


class Recipe(RecipeBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now, sa_column_kwargs={"onupdate": datetime.now}
    )
    user_id: UUID = Field(foreign_key="user.id")
    ingredients: list["RecipeIngredient"] = Relationship(back_populates="recipe")
    user: list["User"] = Relationship(back_populates="recipe")


class RecipeCreate(RecipeBase):
    ingredients: list["RecipeIngredientCreate"]


class RecipeUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = Field(default=None, min_length=10, max_length=1000)
    instructions: str | None = Field(default=None, min_length=10, max_length=1000)
    cooking_time: int | None = Field(default=None, ge=0)
    preparation_time: int | None = Field(default=None, ge=0)
    servings: int | None = Field(default=None, gt=0)
    cuisine: str | None = Field(default=None, min_length=1, max_length=100)
    dietary_restrictions: str | None = Field(default=None, max_length=255)
    image_url: str | None = None
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))


class RecipePublic(RecipeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    ingredients: list["RecipeIngredient"]


class RecipeIngredientBase(SQLModel):
    quantity: str = Field(max_length=50, min_length=1)
    unit: str = Field(min_length=1, max_length=50)


class RecipeIngredient(RecipeIngredientBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipe.id")
    ingredient_id: UUID = Field(foreign_key="ingredient.id")

    recipe: Recipe = Relationship(back_populates="ingredients")
    ingredient: "Ingredient" = Relationship(back_populates="recipes")


class RecipeIngredientCreate(RecipeIngredientBase):
    ingredient_id: UUID


class IngredientBase(SQLModel):
    name: str = Field(..., index=True, unique=True, min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)


class Ingredient(IngredientBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    recipes: list["RecipeIngredient"] = Relationship(back_populates="ingredient")
