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
from app.models.user import RecipeWithUser, User, UserForRecipe
from app.services.recipe_service import RecipeService
from app.utils import CurrentUser, SessionDep
from app.utils.util import ErrorResponse, SuccessResponse

router = APIRouter()


def get_recipe_service(db: SessionDep) -> RecipeService:
    """Dependency to get recipe service."""
    return RecipeService(db)


@router.get("/", response_model=list[RecipeWithUser])
def get_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=250),
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Retrieve a list of recipes with their associated users.

    - **skip**: Number of records to skip for pagination
    - **limit**: Maximum number of recipes to return
    """
    return recipe_service.get_recipes_with_users(skip, limit)


@router.get("/p/{recipe_id}", response_model=RecipePublic)
def get_recipe(
    recipe_id: UUID, recipe_service: RecipeService = Depends(get_recipe_service)
):
    """
    Retrieve a specific recipe by its ID.

    - **recipe_id**: Unique identifier of the recipe
    """
    recipe = recipe_service.get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    return recipe


@router.post("/create", response_model=RecipePublic)
def create_recipe(
    recipe: Annotated[Json[RecipeCreate], Form()],
    image: Annotated[UploadFile, File()],
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Create a new recipe.

    - **recipe**: Recipe details in JSON format
    - **image**: Recipe image file
    - **current_user**: Authenticated user creating the recipe
    """
    try:
        return recipe_service.create_recipe(recipe, image, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/delete/{recipe_id}", response_model=dict)
def delete_recipe(
    recipe_id: UUID,
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Delete a specific recipe.

    - **recipe_id**: Unique identifier of the recipe to delete
    - **current_user**: Authenticated user deleting the recipe
    """
    try:
        return recipe_service.delete_recipe(recipe_id, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/search", response_model=list[RecipePublic])
def search_recipes(
    query: str = Query(..., min_length=3, max_length=100),
    cuisine: str | None = None,
    max_cooking_time: int | None = Query(None, ge=1, le=1440),
    tags: list[str] | None = Query(None),
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Search recipes with optional filtering.

    - **query**: Search term (at least 3 characters)
    - **cuisine**: Optional cuisine filter
    - **max_cooking_time**: Optional maximum cooking time in minutes
    - **tags**: Optional list of tags to filter by
    """
    return recipe_service.search_recipes(query, cuisine, max_cooking_time, tags)


@router.get("/trends", response_model=list[RecipeTrending])
def get_trending_recipes(recipe_service: RecipeService = Depends(get_recipe_service)):
    """Retrieve trending recipes."""
    return recipe_service.get_trending_recipes()


@router.get("/{recipe_id}/similar", response_model=list[RecipePublic])
def get_similar_recipes(
    recipe_id: UUID,
    limit: int = Query(5, ge=1, le=20),
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Get similar recipes to a given recipe.

    - **recipe_id**: Base recipe to find similar recipes from
    - **limit**: Maximum number of similar recipes to return
    """
    return recipe_service.get_similar_recipes(recipe_id, limit)


@router.get("/me", response_model=list[RecipePublic])
def get_user_recipes(
    current_user: CurrentUser,
    recipe_service: RecipeService = Depends(get_recipe_service),
):
    """
    Retrieve recipes created by the current user.

    - **current_user**: Authenticated user
    """
    return recipe_service.get_user_recipes(current_user.id)


@router.post(
    "/{recipe_id}/like",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"model": SuccessResponse},
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
    },
)
def like_recipe(recipe_id: UUID, user: CurrentUser, session: SessionDep):
    """
    Like a recipe.

    - **recipe_id**: Unique identifier of the recipe to like
    - **user**: Authenticated user liking the recipe
    """
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Check if the user has already liked the recipe
    existing_like = session.exec(
        select(Like).where(Like.recipe_id == recipe_id, Like.user_id == user.id)
    ).first()

    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already liked this recipe",
        )

    # Create a new like
    new_like = Like(recipe_id=recipe_id, user_id=user.id)
    session.add(new_like)

    # Increment the total_liked count
    recipe.total_liked = (recipe.total_liked or 0) + 1
    session.commit()
    session.refresh(recipe)

    return SuccessResponse(detail="Recipe liked successfully")


@router.delete(
    "/{recipe_id}/like",
    status_code=status.HTTP_200_OK,
    response_model=SuccessResponse,
    responses={
        200: {"model": SuccessResponse},
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
    },
)
def unlike_recipe(recipe_id: UUID, user: CurrentUser, session: SessionDep):
    """
    Unlike a previously liked recipe.

    - **recipe_id**: Unique identifier of the recipe to unlike
    - **user**: Authenticated user unliking the recipe
    """
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Check if the user has liked the recipe
    like = session.exec(
        select(Like).where(Like.recipe_id == recipe_id, Like.user_id == user.id)
    ).first()

    if not like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have not liked this recipe",
        )

    # Delete the like
    session.delete(like)

    # Safely decrement the total_liked count
    recipe.total_liked = max(0, (recipe.total_liked or 0) - 1)

    # Commit the transaction
    session.commit()
    session.refresh(recipe)

    return SuccessResponse(detail="Recipe unliked successfully")


@router.post(
    "/{recipe_id}/comments",
    status_code=status.HTTP_201_CREATED,
    response_model=SuccessResponse,
)
def create_comment(
    recipe_id: UUID,
    user: CurrentUser,
    session: SessionDep,
    comment: str = Form(..., min_length=1, max_length=1000),
):
    """
    Add a comment to a recipe.

    - **recipe_id**: Unique identifier of the recipe to comment on
    - **comment**: Text of the comment (1-1000 characters)
    - **user**: Authenticated user creating the comment
    """
    # Check if the recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Create a new comment
    new_comment = Comment(recipe_id=recipe_id, user_id=user.id, content=comment)
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)

    return SuccessResponse(detail="Comment posted successfully")


@router.get("/{recipe_id}/comments", response_model=list[Comment])
def get_comments(
    recipe_id: UUID,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    """
    Retrieve comments for a specific recipe.

    - **recipe_id**: Unique identifier of the recipe
    - **skip**: Number of comments to skip for pagination
    - **limit**: Maximum number of comments to return
    """
    # Check if the recipe exists first
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Fetch comments for the recipe with pagination
    comments = session.exec(
        select(Comment).where(Comment.recipe_id == recipe_id).offset(skip).limit(limit)
    ).all()

    return comments


@router.get("/{recipe_id}/likes", response_model=list[UserForRecipe])
def get_likers(recipe_id: str, session: SessionDep):
    """
    Fetch users who liked a specific recipe.

    - **recipe_id**: Unique identifier of the recipe
    """
    recipe = session.get(Recipe, UUID(recipe_id))
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    # Query to fetch all users who liked the recipe
    likers = session.exec(
        select(User).join(Like).where(Like.recipe_id == UUID(recipe_id))
    ).all()

    return likers
