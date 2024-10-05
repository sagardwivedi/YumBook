from sqlmodel import SQLModel


class Token(SQLModel):
    access_token: str
    token_type: str = "Bearer"


class TokenPayload(SQLModel):
    sub: str | None = None
