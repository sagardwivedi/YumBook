from uuid import UUID

from fastapi import HTTPException, status
from pydantic import EmailStr
from sqlmodel import Session, select

from app.models.user import User, UserCreate
from app.services.auth_service import AuthService
from app.utils.util import raise_http_exception


class UserService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.authService = AuthService()

    def _user_exists(self, email: str, username: str) -> bool:
        """Check if a user with the given email or username already exists."""
        return (
            self.session.exec(
                select(User).where(User.email == email or User.username == username)
            ).first()
            is not None
        )

    def get_user_by_email(self, email: EmailStr) -> User | None:
        return self.session.exec(select(User).where(User.email == email)).first()

    def get_user_by_id(self, id: UUID) -> User | None:
        return self.session.get(User, id)

    def create_user(self, user: UserCreate) -> User | None:
        if self._user_exists(user.email, user.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists",
            )

        try:
            db_user = User.model_validate(
                user,
                update={"password_hash": self.authService.hash_password(user.password)},
            )

            self.session.add(db_user)
            self.session.commit()
            self.session.refresh(db_user)
            return db_user
        except Exception:
            self.session.rollback()

    def authenticate(self, username: str, password: str) -> User | None:
        db_user = self.session.exec(
            select(User).where(User.username == username or User.email == username)
        ).first()

        if db_user and self.authService.verify_password(
            password, db_user.password_hash
        ):
            return db_user

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    def update_password(self, user: User, password: str):
        """
        Update the user's password.

        Args:
            user: The user whose password will be updated.
            password: The new password to be set.

        Returns:
            bool: True if the update was successful, False otherwise.
        """
        hashed_password = self.authService.hash_password(password)
        try:
            user.password_hash = hashed_password
            self.session.add(user)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise_http_exception(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update password: {str(e)}",
            )
