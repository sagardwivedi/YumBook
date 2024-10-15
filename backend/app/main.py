import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import api_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Mounting the "images/profile" route to serve profile images
app.mount(
    f"/{settings.PROFILE_DIR}",
    StaticFiles(directory=settings.PROFILE_DIR),
    name="profile",
)

# Mounting the "images/recipe" route to serve recipe images
app.mount(
    f"/{settings.POST_DIR}", StaticFiles(directory=settings.POST_DIR), name="post"
)

# Mounting the "videos" route to serve videos
app.mount(
    f"/{settings.VIDEO_DIR}", StaticFiles(directory=settings.VIDEO_DIR), name="videos"
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
