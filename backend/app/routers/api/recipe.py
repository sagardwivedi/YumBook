from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.models.recipe import RecipeCreate, RecipeIngredient, RecipePublic, RecipeUpdate
from app.services.recipe_service import RecipeService
from app.utils import CurrentUser, SessionDep

router = APIRouter()


def get_recipe_service(db: SessionDep) -> RecipeService:
    return RecipeService(db)


@router.get("/", response_model=list[RecipePublic])
def get_recipes(
    skip: int = 0,
    limit: int = 100,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.get_recipes(skip, limit)


@router.get("/{recipe_id}", response_model=RecipePublic)
def get_recipe(
    recipe_id: UUID, recipe_service: RecipeService = Depends(get_recipe_service)
):
    return recipe_service.get_recipe(recipe_id)


@router.post("/", response_model=RecipePublic)
def create_recipe(
    recipe: RecipeCreate,
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.create_recipe(recipe, current_user.id)


@router.put("/{recipe_id}", response_model=RecipePublic)
def update_recipe(
    recipe_id: UUID,
    recipe_update: RecipeUpdate,
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.update_recipe(recipe_id, recipe_update, current_user.id)


@router.delete("/{recipe_id}", response_model=dict)
def delete_recipe(
    recipe_id: UUID,
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.delete_recipe(recipe_id, current_user.id)


@router.get("/search", response_model=list[RecipePublic])
def search_recipes(
    query: str = Query(..., min_length=3),
    cuisine: str | None = None,
    max_cooking_time: int | None = None,
    tags: list[str] = Query(None),
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.search_recipes(query, cuisine, max_cooking_time, tags)


@router.get("/trending", response_model=list[RecipePublic])
def get_trending_recipes(
    limit: int = 10, recipe_service: RecipeService = Depends(get_recipe_service)
):
    return recipe_service.get_trending_recipes(limit)


@router.get("/{recipe_id}/similar", response_model=list[RecipePublic])
def get_similar_recipes(
    recipe_id: UUID,
    limit: int = 5,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.get_similar_recipes(recipe_id, limit)


@router.get("/ingredients", response_model=list[RecipeIngredient])
def get_all_ingredients(recipe_service: RecipeService = Depends(get_recipe_service)):
    return recipe_service.get_all_ingredients()


@router.get("/user/{user_id}/recipes", response_model=list[RecipePublic])
def get_user_recipes(
    user_id: UUID, recipe_service: RecipeService = Depends(get_recipe_service)
):
    return recipe_service.get_user_recipes(user_id)
