"""alter column dietary_restrictions  recipe table

Revision ID: 3305221c53f7
Revises: 7bf4e8bf4a43
Create Date: 2024-11-03 19:14:34.008244

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3305221c53f7"
down_revision: str | None = "7bf4e8bf4a43"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###

    # First, you might want to ensure that the existing data can be cast to JSON
    op.execute(
        "ALTER TABLE recipe ALTER COLUMN dietary_restrictions TYPE JSON USING dietary_restrictions::json"
    )

    # Alter the image_url column to set it as NOT NULL
    op.alter_column("recipe", "image_url", existing_type=sa.VARCHAR(), nullable=False)

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("recipe", "image_url", existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column(
        "recipe",
        "dietary_restrictions",
        existing_type=sa.JSON(),
        type_=sa.VARCHAR(length=255),
        existing_nullable=True,
    )
    # ### end Alembic commands ###
