from fastapi import APIRouter

from app.routers.api import auth, recipe, user

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(recipe.router, prefix="/recipe", tags=["recipe"])
