"""Added user, recipe, follows, and comment table

Revision ID: 0a3bebc01621
Revises: 
Create Date: 2025-01-08 16:38:03.657283

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '0a3bebc01621'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('email', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('full_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('profile_image_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('hashed_password', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('is_superuser', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table('recipe',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
    sa.Column('ingredients', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
    sa.Column('preparation_steps', sqlmodel.sql.sqltypes.AutoString(length=1000), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('owner_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('userfollow',
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('followed_user_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['followed_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'followed_user_id')
    )
    op.create_table('comment',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('content', sqlmodel.sql.sqltypes.AutoString(length=1000), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('recipe_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipe.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recipeimage',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('image_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('recipe_id', sa.Uuid(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipe.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recipereaction',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('recipe_id', sa.Uuid(), nullable=False),
    sa.Column('reaction', sa.Enum('like', name='reactionenum'), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipe.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recipereaction')
    op.drop_table('recipeimage')
    op.drop_table('comment')
    op.drop_table('userfollow')
    op.drop_table('recipe')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
