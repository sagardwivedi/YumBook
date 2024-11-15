from typing import Annotated
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from pydantic import Json
from sqlmodel import select

from app.models.recipe import (
    Comment,
    Like,
    Recipe,
    RecipeCreate,
    RecipePublic,
    RecipeTrending,
)
from app.models.user import RecipeWithUser
from app.services.recipe_service import RecipeService
from app.utils import CurrentUser, SessionDep
from app.utils.util import ErrorResponse, SuccessResponse

router = APIRouter()


def get_recipe_service(db: SessionDep) -> RecipeService:
    return RecipeService(db)


@router.get("/", response_model=list[RecipeWithUser])
def get_recipes(
    skip: int = 0,
    limit: int = 100,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.get_recipes_with_users(skip, limit)


@router.get("/p/{recipe_id}", response_model=RecipePublic)
def get_recipe(
    recipe_id: UUID, recipe_service: RecipeService = Depends(get_recipe_service)
):
    return recipe_service.get_recipe(recipe_id)


@router.post("/create", response_model=RecipePublic)
def create_recipe(
    recipe: Annotated[Json[RecipeCreate], Form()],
    image: Annotated[UploadFile, File()],
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.create_recipe(recipe, image, current_user.id)


@router.delete("/delete/{recipe_id}", response_model=dict)
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


@router.get("/recipe_trends", response_model=list[RecipeTrending])
def get_trending_recipes(recipe_service: RecipeService = Depends(get_recipe_service)):
    return recipe_service.get_trending_recipes()


@router.get("/{recipe_id}/similar", response_model=list[RecipePublic])
def get_similar_recipes(
    recipe_id: UUID,
    limit: int = 5,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.get_similar_recipes(recipe_id, limit)


@router.get("/user", response_model=list[RecipePublic])
def get_user_recipes(
    currentUser: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    return recipe_service.get_user_recipes(currentUser.id)


@router.post(
    "/like/{recipe_id}",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"model": SuccessResponse},
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
    },
)
def like_recipe(recipe_id: UUID, user: CurrentUser, session: SessionDep):
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Check if the user has already liked the recipe
    like = session.exec(
        select(Like).where(Like.recipe_id == recipe_id, Like.user_id == user.id)
    ).first()
    if like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already liked this recipe",
        )

    # Create a new like
    new_like = Like(recipe_id=recipe_id, user_id=user.id)
    session.add(new_like)
    session.commit()

    # Increment the total_liked count
    recipe.total_liked += 1
    session.commit()

    return SuccessResponse(detail="Recipe liked")


@router.delete(
    "/like/{recipe_id}",
    status_code=status.HTTP_200_OK,
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
    },
)
def unlike_recipe(recipe_id: UUID, user: CurrentUser, session: SessionDep):
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Check if the user has already liked the recipe
    like = session.exec(
        select(Like).where(Like.recipe_id == recipe_id, Like.user_id == user.id)
    ).first()
    if not like:
        raise HTTPException(status_code=400, detail="You have not liked this recipe")

    # Delete the like
    session.delete(like)
    session.commit()

    # Decrement the total_liked count
    recipe.total_liked -= 1
    session.commit()

    return SuccessResponse(detail="Recipe unliked")


@router.post("/{recipe_id}/comment", status_code=201)
def create_comment(
    recipe_id: UUID, comment: str, user: CurrentUser, session: SessionDep
):
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Create a new comment
    new_comment = Comment(recipe_id=recipe_id, user_id=user.id, content=comment)
    session.add(new_comment)
    session.commit()
    return SuccessResponse(detail="Comment Posted")


@router.get("/{recipe_id}/comments")
def get_comments(recipe_id: UUID, session: SessionDep):
    # Fetch all comments for the recipe
    comments = session.exec(select(Comment).where(Comment.recipe_id == recipe_id)).all()
    return comments
