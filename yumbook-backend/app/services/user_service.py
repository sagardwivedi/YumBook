from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.user import User, UserCreate
from app.utils.auth import hash_password


class UserService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_user(self, user: UserCreate) -> bool:
        existing_user = self.session.exec(
            select(User).where(
                User.email == user.email or User.username == user.username
            )
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists",
            )

        try:
            db_obj = User.model_validate(
                user,
                update={"password_hash": hash_password(user.password)},
            )

            self.session.add(db_obj)
            self.session.commit()
            self.session.refresh(db_obj)
            return True
        except Exception:
            self.session.rollback()
            return False
