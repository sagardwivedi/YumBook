import os
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from pydantic import EmailStr
from sqlmodel import Session, select

from app.config import settings
from app.models import User, UserCreate
from app.models.user import UserUpdate
from app.services.auth_service import AuthService
from app.utils import raise_http_exception
from app.utils.util import SuccessResponseWithData


class UserService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.authService = AuthService()

    def _save_image(self, file: UploadFile, filename: str) -> str:
        """Helper function to save an image to the PROFILE_DIR directory."""
        file_path = os.path.join(settings.PROFILE_DIR, filename)

        # Ensure the directory exists
        os.makedirs(settings.PROFILE_DIR, exist_ok=True)

        try:
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())
            return file_path
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving file: {str(e)}",
            )

    def _validate_image_file(self, file: UploadFile) -> None:
        """Helper function to validate the uploaded image file type."""
        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        allowed_extensions = {"png", "jpg", "jpeg", "gif"}
        file_extension = file.filename.split(".")[-1].lower()

        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Allowed types: png, jpg, jpeg, gif",
            )

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

    def get_user_by_username(self, username: str) -> User | None:
        return self.session.exec(select(User).where(User.username == username)).first()

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

    def update_user(self, current_user: User, data: UserUpdate) -> User:
        """
        Update the current user's username.

        Args:
            current_user: The user object representing the current user.
            data: A `UserUpdate` object with the fields to update.

        Returns:
            The updated user object.

        Raises:
            HTTPException: If the username is already in use.
        """

        # Check if the username is being updated and is unique
        if data.username and data.username != current_user.username:
            existing_user = self.get_user_by_username(data.username)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username is already in use by another user.",
                )
            # Update the username if it's unique
            current_user.username = data.username

        try:
            # Commit the changes to the database
            self.session.add(current_user)
            self.session.commit()
            self.session.refresh(current_user)
        except Exception as e:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update user profile: {str(e)}",
            )

        return current_user

    def upload_profile_image(
        self, file: UploadFile, current_user: User
    ) -> SuccessResponseWithData:
        """Upload a new profile image for the user."""
        self._validate_image_file(file)

        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        # Create a unique filename using UUID
        unique_filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        file_path = self._save_image(file, unique_filename)

        # Update the user's profile image path
        current_user.profile_picture = file_path
        self.session.add(current_user)
        self.session.commit()

        return SuccessResponseWithData(
            detail="Photo Uploaded", data={"path": file_path}
        )

    def update_profile_image(
        self, file: UploadFile, current_user: User
    ) -> SuccessResponseWithData:
        """Update an existing profile image for the user."""
        self._validate_image_file(file)

        # If a profile image already exists, delete the old one
        if current_user.profile_picture:
            old_file_path = current_user.profile_picture
            if os.path.exists(old_file_path):
                os.remove(old_file_path)

        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        # Save the new profile image
        unique_filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        file_path = self._save_image(file, unique_filename)

        # Update the user's profile image path
        current_user.profile_picture = file_path
        self.session.add(current_user)
        self.session.commit()

        return SuccessResponseWithData(
            detail="Photo Uploaded", data={"path": file_path}
        )

    def delete_profile_image(self, current_user: User) -> None:
        """Delete the user's profile image."""
        if not current_user.profile_picture:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No profile picture to delete",
            )

        file_path = current_user.profile_picture

        # Delete the file from the directory
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error deleting file: {str(e)}",
                )

        # Update the user's profile to remove the image reference
        current_user.profile_picture = None
        self.session.add(current_user)
        self.session.commit()
