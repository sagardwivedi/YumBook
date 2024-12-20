"""Hello

Revision ID: d1ac4e418880
Revises: 5abf312c1acc
Create Date: 2024-11-28 01:43:23.775036

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d1ac4e418880"
down_revision: str | None = "5abf312c1acc"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("user", "avatar_path", existing_type=sa.VARCHAR(), nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("user", "avatar_path", existing_type=sa.VARCHAR(), nullable=False)
    # ### end Alembic commands ###