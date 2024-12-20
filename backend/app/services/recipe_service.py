import os
from collections.abc import Sequence
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from sqlmodel import Session, desc, select

from app.config import settings
from app.models.recipe import Recipe, RecipeCreate
from app.models.user import User
from app.utils.util import save_image, validate_image_file


class RecipeService:
    def __init__(self, db: Session):
        self.db = db

    def _check_authorization(self, db_recipe: Recipe, user_id: UUID) -> None:
        """Helper method to check if the user is authorized to modify a recipe."""
        if db_recipe.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to modify this recipe"
            )

    def get_recipes_with_users(self, skip: int = 0, limit: int = 100):
        results = self.db.exec(
            select(Recipe, User).join(User).offset(skip).limit(limit)
        ).all()

        return [{"recipe": recipe, "user": user} for recipe, user in results]

    def get_recipe(self, recipe_id: UUID) -> Recipe:
        recipe = self.db.get(Recipe, recipe_id)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe

    def upload_recipe_image(self, file: UploadFile):
        validate_image_file(file)

        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        unique_filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        file_path = save_image(file, settings.POST_DIR, unique_filename)

        try:
            return file_path
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile image: {str(e)}",
            )

    def create_recipe(
        self, recipe: RecipeCreate, image: UploadFile, user_id: UUID
    ) -> Recipe:
        db_recipe = Recipe.model_validate(
            recipe,
            update={
                "user_id": user_id,
                "image_url": self.upload_recipe_image(image),
            },
        )
        self.db.add(db_recipe)
        self.db.commit()
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
            statement = statement.where(Recipe.tags.__contains__(tags))
        return self.db.exec(statement).all()

    def get_trending_recipes(self):
        # Ordering by created_at to get trending recipes (you can improve this by adding metrics)
        data = self.db.exec(
            select(Recipe, User).join(User).order_by(desc(Recipe.created_at))
        ).all()
        return [
            {
                "id": recipe.id,
                "image_url": recipe.image_url,
                "name": recipe.name,
                "username": user.username,
            }
            for recipe, user in data
        ]

    def get_similar_recipes(self, recipe_id: UUID, limit: int = 5) -> Sequence[Recipe]:
        original_recipe = self.get_recipe(recipe_id)

        # Get similar recipes by cuisine, excluding the current recipe
        return self.db.exec(
            select(Recipe)
            .where(Recipe.cuisine == original_recipe.cuisine, Recipe.id != recipe_id)
            .order_by(desc(Recipe.created_at))
            .limit(limit)
        ).all()

    def get_user_recipes(self, user_id: UUID) -> Sequence[Recipe]:
        return self.db.exec(select(Recipe).where(Recipe.user_id == user_id)).all()
