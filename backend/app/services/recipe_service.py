from collections.abc import Sequence
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, desc, select

from app.models.recipe import Ingredient, Recipe, RecipeCreate, RecipeUpdate


class RecipeService:
    def __init__(self, db: Session):
        self.db = db

    def _check_authorization(self, db_recipe: Recipe, user_id: UUID) -> None:
        """Helper method to check if the user is authorized to modify a recipe."""
        if db_recipe.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to modify this recipe"
            )

    def get_recipes(self, skip: int = 0, limit: int = 100) -> Sequence[Recipe]:
        return self.db.exec(select(Recipe).offset(skip).limit(limit)).all()

    def get_recipe(self, recipe_id: UUID) -> Recipe:
        recipe = self.db.get(Recipe, recipe_id)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe

    def create_recipe(self, recipe: RecipeCreate, user_id: UUID) -> Recipe:
        db_recipe = Recipe.model_validate(recipe)
        db_recipe.user_id = user_id
        self.db.add(db_recipe)
        self.db.commit()
        # No need to refresh unless you need to return generated fields
        return db_recipe

    def update_recipe(
        self, recipe_id: UUID, recipe_update: RecipeUpdate, user_id: UUID
    ) -> Recipe:
        db_recipe = self.get_recipe(recipe_id)
        self._check_authorization(db_recipe, user_id)  # Reuse authorization check

        # Only update the fields that are present in the `recipe_update`
        update_data = recipe_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_recipe, key, value)

        self.db.commit()  # Commit once after all changes
        self.db.refresh(db_recipe)
        return db_recipe

    def delete_recipe(self, recipe_id: UUID, user_id: UUID) -> dict:
        db_recipe = self.get_recipe(recipe_id)
        self._check_authorization(db_recipe, user_id)

        self.db.delete(db_recipe)
        self.db.commit()
        return {"message": "Recipe deleted successfully"}

    def search_recipes(
        self,
        query: str,
        cuisine: str | None = None,
        max_cooking_time: int | None = None,
        tags: list[str] | None = None,
    ) -> Sequence[Recipe]:
        statement = select(Recipe).where(
            Recipe.name.startswith(f"%{query}%")
            | Recipe.description.startswith(f"%{query}%")
        )

        # Chain all conditions for better readability
        if cuisine:
            statement = statement.where(Recipe.cuisine == cuisine)
        if max_cooking_time is not None:
            statement = statement.where(Recipe.cooking_time <= max_cooking_time)
        if tags:
            statement = statement.where(Recipe.tags.contains[tags])
        return self.db.exec(statement).all()

    def get_trending_recipes(self, limit: int = 10) -> Sequence[Recipe]:
        # Ordering by created_at to get trending recipes (you can improve this by adding metrics)
        return self.db.exec(
            select(Recipe).order_by(desc(Recipe.created_at)).limit(limit)
        ).all()

    def get_similar_recipes(self, recipe_id: UUID, limit: int = 5) -> Sequence[Recipe]:
        original_recipe = self.get_recipe(recipe_id)

        # Get similar recipes by cuisine, excluding the current recipe
        return self.db.exec(
            select(Recipe)
            .where(Recipe.cuisine == original_recipe.cuisine, Recipe.id != recipe_id)
            .order_by(desc(Recipe.created_at))
            .limit(limit)
        ).all()

    def get_all_ingredients(self) -> Sequence[Ingredient]:
        return self.db.exec(select(Ingredient)).all()

    def get_user_recipes(self, user_id: UUID) -> Sequence[Recipe]:
        return self.db.exec(select(Recipe).where(Recipe.user_id == user_id)).all()
