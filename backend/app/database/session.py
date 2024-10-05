from collections.abc import Generator

from sqlalchemy import create_engine
from sqlmodel import Session

from app.config import settings

# Create the database engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
