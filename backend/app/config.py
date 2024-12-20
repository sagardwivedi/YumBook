import secrets
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    HttpUrl,
    PostgresDsn,
    computed_field,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    """Configuration settings for the application."""

    # Model configuration for environment file and settings
    model_config = SettingsConfigDict(
        env_file="../.env",  # Path to .env file
        env_ignore_empty=True,
        extra="ignore",  # Ignore extra fields not in the model
    )

    # API and security settings
    API_V1_STR: str = "/api/v1"
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = secrets.token_urlsafe(32)  # Secure token for JWT

    # Token expiration settings (8 days)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # Frontend and environment settings
    FRONTEND_HOST: str = "http://localhost:3000"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    PROFILE_DIR: str = "static/profile"
    POST_DIR: str = "static/post"

    # CORS settings
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    # Computed field to return all CORS origins including the frontend host
    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    # Database settings
    PROJECT_NAME: str
    SENTRY_DSN: HttpUrl | None = None
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    # Computed field for generating the SQLAlchemy database URI
    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )


# Instantiate the settings object (type: ignore to suppress mypy warnings)
settings = Settings()  # type: ignore