from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app import crud
from app.api.deps import SessionDep
from app.models import UserPublic, UserRegister

router = APIRouter(prefix="/users", tags=["users"])


class ErrorResponse(BaseModel):
    detail: str


@router.post("/", response_model=UserPublic, responses={400: {"model": ErrorResponse}})
def create_user(*, session: SessionDep, user_in: UserRegister):
    user = crud.get_user_by_email(
        session=session, email=user_in.email, username=user_in.username
    )
    if user:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )

    user = crud.create_user(session=session, user_create=user_in)
    return user
