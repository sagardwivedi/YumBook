"""New tables

Revision ID: 54b85d119c09
Revises: d1ac4e418880
Create Date: 2024-12-04 00:30:48.689104

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "54b85d119c09"
down_revision: str | None = "d1ac4e418880"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "follow",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("follower_id", sa.Uuid(), nullable=False),
        sa.Column("followed_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(
            ["followed_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["follower_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.alter_column(
        "user", "full_name", existing_type=sa.VARCHAR(length=255), nullable=True
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "user", "full_name", existing_type=sa.VARCHAR(length=255), nullable=False
    )
    op.drop_table("follow")
    # ### end Alembic commands ###
