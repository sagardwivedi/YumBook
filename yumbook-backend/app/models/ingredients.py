from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.models.recipe import RecipeIngredient


class IngredientBase(SQLModel):
    name: str = Field(..., index=True, unique=True, min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=True)


class Ingredient(IngredientBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Relationship with RecipeIngredient
    recipes: list["RecipeIngredient"] = Relationship(back_populates="ingredient")
