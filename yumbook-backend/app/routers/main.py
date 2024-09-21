from fastapi import APIRouter

from app.routers.api import auth

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
