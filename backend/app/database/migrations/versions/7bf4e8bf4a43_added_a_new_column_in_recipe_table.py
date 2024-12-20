"""Added a new column in recipe table

Revision ID: 7bf4e8bf4a43
Revises: 1a578961f933
Create Date: 2024-11-03 17:33:56.830947

"""

from collections.abc import Sequence

import sqlalchemy as sa
import sqlmodel
import sqlmodel.sql.sqltypes
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7bf4e8bf4a43"
down_revision: str | None = "1a578961f933"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add the column as nullable initially
    op.add_column(
        "recipe",
        sa.Column("difficulty", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )
    # Populate the column for existing rows
    op.execute("UPDATE recipe SET difficulty = 'medium' WHERE difficulty IS NULL")
    # Alter the column to be non-nullable
    op.alter_column("recipe", "difficulty", nullable=False)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("recipe", "difficulty")
    # ### end Alembic commands ###