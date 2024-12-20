import os
from typing import Any

from fastapi import HTTPException, Request, UploadFile, status
from fastapi.openapi.models import OAuthFlowPassword
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from pydantic import BaseModel


class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str | None = None,
        scopes: dict[str, str] | None = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(
            password=OAuthFlowPassword(tokenUrl=tokenUrl, scopes=scopes)
        )
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> str | None:
        authorization: str | None = request.cookies.get("access_token")
        scheme, param = get_authorization_scheme_param(authorization)

        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
        return param


class ErrorResponse(BaseModel):
    detail: str


class SuccessResponse(BaseModel):
    detail: str


class SuccessResponseWithData(SuccessResponse):
    data: dict[str, Any]


def raise_http_exception(status_code: int, detail: str) -> None:
    raise HTTPException(status_code=status_code, detail=detail)


def save_image(file: UploadFile, dir: str, filename: str) -> str:
    """
    Helper function to save an image to the PROFILE_DIR directory.

    Args:
        file: The uploaded file
        filename: The name to save the file as

    Returns:
        str: The path where the file was saved

    Raises:
        HTTPException: If there's an error saving the file
    """
    file_path = os.path.join(dir, filename)
    os.makedirs(dir, exist_ok=True)

    try:
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            if not content:
                raise ValueError("Empty file content")
            buffer.write(content)
        return file_path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}",
        )


def validate_image_file(file: UploadFile) -> None:
    """
    Helper function to validate the uploaded image file type.

    Args:
        file: The uploaded file to validate

    Raises:
        HTTPException: If the file is invalid
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided for the upload.",
        )

    allowed_extensions = {"png", "jpg", "jpeg", "gif"}
    try:
        file_extension = file.filename.split(".")[-1].lower()
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. No file extension found.",
        )

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed types: png, jpg, jpeg, gif",
        )
