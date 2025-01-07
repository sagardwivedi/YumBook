from fastapi import APIRouter, HTTPException, status

from app import crud
from app.api.deps import SessionDep
from app.models import UserPublic, UserRegister

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserPublic)
def create_user(*, session: SessionDep, user_in: UserRegister):
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )

    user = crud.create_user(session=session, user_create=user_in)
    return user
