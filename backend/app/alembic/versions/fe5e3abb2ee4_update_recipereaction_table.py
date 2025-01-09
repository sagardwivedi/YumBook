"""update recipereaction table

Revision ID: fe5e3abb2ee4
Revises: 0a3bebc01621
Create Date: 2025-01-08 16:42:56.255803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'fe5e3abb2ee4'
down_revision: Union[str, None] = '0a3bebc01621'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('recipereaction', 'reaction')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('recipereaction', sa.Column('reaction', postgresql.ENUM('like', name='reactionenum'), autoincrement=False, nullable=False))
    # ### end Alembic commands ###