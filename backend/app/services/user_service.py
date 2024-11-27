import os
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile, status
from pydantic import EmailStr
from sqlmodel import Session, or_, select

from app.config import settings
from app.models import User, UserCreate, UserUpdate
from app.services.auth_service import AuthService
from app.utils.util import SuccessResponseWithData, save_image, validate_image_file


class UserService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.authService = AuthService()

    def _user_exists(
        self, email: str | None = None, username: str | None = None
    ) -> bool:
        """
        Check if a user with the given email or username already exists.

        Args:
            email: Optional email to check
            username: Optional username to check

        Returns:
            bool: True if a user exists with the given criteria
        """
        if not email and not username:
            return False

        query = select(User)
        conditions = []

        if email:
            conditions.append(User.email == email)
        if username:
            conditions.append(User.username == username)

        if conditions:
            query = query.where(or_(*conditions))
            return self.session.exec(query).first() is not None
        return False

    def get_user_by_email(self, email: EmailStr) -> User | None:
        """Get a user by their email address."""
        return self.session.exec(select(User).where(User.email == email)).first()

    def get_user_by_id(self, id: UUID) -> User | None:
        """Get a user by their ID."""
        return self.session.get(User, id)

    def get_user_by_username(self, username: str) -> User | None:
        """Get a user by their username."""
        return self.session.exec(select(User).where(User.username == username)).first()

    def create_user(self, user: UserCreate) -> User:
        """
        Create a new user.

        Args:
            user: The user data for creation

        Returns:
            User: The created user

        Raises:
            HTTPException: If user creation fails
        """
        if self._user_exists(email=user.email, username=user.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists",
            )

        try:
            db_user = User.model_validate(
                user,
                update={
                    "password_hash": self.authService.hash_password(user.password),
                    "avatar_path": None,
                },
            )

            self.session.add(db_user)
            self.session.commit()
            self.session.refresh(db_user)
            return db_user
        except Exception as e:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user: {str(e)}",
            )

    def authenticate(self, username: str, password: str) -> User:
        """
        Authenticate a user with username/email and password.

        Args:
            username: Username or email
            password: User's password

        Returns:
            User: The authenticated user

        Raises:
            HTTPException: If authentication fails
        """
        db_user = self.session.exec(
            select(User).where((User.username == username) | (User.email == username))
        ).first()

        if not db_user or not self.authService.verify_password(
            password, db_user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        return db_user

    def update_user(self, current_user: User, data: UserUpdate) -> User:
        """
        Update user information.

        Args:
            current_user: The current user to update
            data: The data to update

        Returns:
            User: The updated user

        Raises:
            HTTPException: If update fails
        """
        # Check username uniqueness if it's being updated
        if data.username and data.username != current_user.username:
            if self._user_exists(username=data.username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username is already in use.",
                )

        # Check email uniqueness if it's being updated
        if data.email and data.email != current_user.email:
            if self._user_exists(email=data.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email is already in use.",
                )

        try:
            # Update only provided fields
            for field, value in data.model_dump(exclude_unset=True).items():
                setattr(current_user, field, value)

            self.session.add(current_user)
            self.session.commit()
            self.session.refresh(current_user)
            return current_user
        except Exception as e:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update user: {str(e)}",
            )

    def update_password(self, user: User, password: str) -> None:
        """
        Update the user's password.

        Args:
            user: The user whose password will be updated
            password: The new password

        Raises:
            HTTPException: If password update fails
        """
        try:
            user.password_hash = self.authService.hash_password(password)
            self.session.add(user)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update password: {str(e)}",
            )

    def upload_profile_image(
        self, file: UploadFile, current_user: User
    ) -> SuccessResponseWithData:
        """
        Upload a new profile image for the user.

        Args:
            file: The image file to upload
            current_user: The user whose profile image is being uploaded

        Returns:
            SuccessResponseWithData: Response with the new image path
        """
        validate_image_file(file)

        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        unique_filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        file_path = save_image(file, settings.PROFILE_DIR, unique_filename)

        try:
            current_user.avatar_path = file_path
            self.session.add(current_user)
            self.session.commit()

            return SuccessResponseWithData(
                detail="Profile image uploaded successfully", data={"path": file_path}
            )
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile image: {str(e)}",
            )

    def update_profile_image(
        self, file: UploadFile, current_user: User
    ) -> SuccessResponseWithData:
        """
        Update an existing profile image.

        Args:
            file: The new image file
            current_user: The user whose profile image is being updated

        Returns:
            SuccessResponseWithData: Response with the new image path
        """
        validate_image_file(file)

        # Delete old image if it exists
        if current_user.avatar_path and os.path.exists(current_user.avatar_path):
            try:
                os.remove(current_user.avatar_path)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error deleting old profile image: {str(e)}",
                )

        # Check if file.filename is not None or empty
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided for the upload.",
            )

        unique_filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
        file_path = save_image(file, settings.PROFILE_DIR, unique_filename)

        try:
            current_user.avatar_path = file_path
            self.session.add(current_user)
            self.session.commit()

            return SuccessResponseWithData(
                detail="Profile image updated successfully", data={"path": file_path}
            )
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile image: {str(e)}",
            )

    def delete_profile_image(self, current_user: User) -> None:
        """
        Delete the user's profile image.

        Args:
            current_user: The user whose profile image is being deleted

        Raises:
            HTTPException: If deletion fails
        """
        if not current_user.avatar_path:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No profile image to delete",
            )

        file_path = current_user.avatar_path

        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting profile image: {str(e)}",
            )

        try:
            current_user.avatar_path = None
            self.session.add(current_user)
            self.session.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating user after image deletion: {str(e)}",
            )
