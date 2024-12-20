// This file is auto-generated by @hey-api/openapi-ts

import { z } from "zod";

export const zBody_auth_login_user = z.object({
  grant_type: z.unknown().optional(),
  username: z.string(),
  password: z.string(),
  scope: z.string().optional().default(""),
  client_id: z.unknown().optional(),
  client_secret: z.unknown().optional(),
});

export const zBody_recipe_create_comment = z.object({
  comment: z.string().min(1).max(1000),
});

export const zBody_recipe_create_recipe = z.object({
  recipe: z.string(),
  image: z.string(),
});

export const zBody_users_follow_user = z.object({
  follow_request: z.string().uuid(),
});

export const zBody_users_update_profile_image = z.object({
  file: z.string(),
});

export const zBody_users_upload_profile_image = z.object({
  file: z.string(),
});

export const zComment = z.object({
  id: z.string().uuid().optional(),
  content: z.string().min(1).max(1000),
  created_at: z.string().datetime().optional(),
  recipe_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const zErrorResponse = z.object({
  detail: z.string(),
});

export const zForgotPasswordData = z.object({
  email: z.string().email(),
});

export const zHTTPValidationError = z.object({
  detail: z
    .array(
      z.object({
        loc: z.array(z.unknown()),
        msg: z.string(),
        type: z.string(),
      }),
    )
    .optional(),
});

export const zLikePublic = z.object({
  user_id: z.string().uuid(),
});

export const zRecipeCreate = z.object({
  cuisine: z.string(),
  instructions: z.array(z.string()),
  servings: z.number(),
  name: z.string(),
  cooking_time: z.number(),
  dietary_restrictions: z.array(z.string()),
  preparation_time: z.number(),
  tags: z.array(z.string()),
  description: z.string(),
  difficulty: z.string(),
});

export const zRecipePublic = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(1000),
  instructions: z.array(z.string()).optional(),
  cooking_time: z.number().gte(0),
  preparation_time: z.number().gte(0),
  difficulty: z.string(),
  servings: z.number(),
  cuisine: z.string().min(1).max(100),
  dietary_restrictions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  total_liked: z.number().gte(0).optional().default(0),
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  image_url: z.string(),
  likes: z.array(zLikePublic),
});

export const zRecipeTrending = z.object({
  id: z.string().uuid(),
  image_url: z.string(),
  name: z.string(),
  username: z.string(),
});

export const zRecipeWithUser = z.object({
  recipe: zRecipePublic,
  user: z.object({
    id: z.string().uuid(),
    avatar_path: z.unknown(),
    username: z.string(),
  }),
});

export const zResetPasswordData = z.object({
  token: z.string(),
  new_password: z.string(),
});

export const zSuccessResponse = z.object({
  detail: z.string(),
});

export const zSuccessResponseWithData = z.object({
  detail: z.string(),
  data: z.object({}),
});

export const zUserCreate = z.object({
  password: z.string().min(8).max(40),
  username: z.string().min(3).max(255),
  email: z.string().email().max(255),
  full_name: z.unknown().optional(),
});

export const zUserForRecipe = z.object({
  id: z.string().uuid(),
  avatar_path: z.unknown(),
  username: z.string(),
});

export const zUserPublic = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email().max(255),
  avatar_path: z.unknown().optional(),
  full_name: z.unknown().optional(),
  id: z.string().uuid(),
});

export const zUserUpdate = z.object({
  username: z.unknown().optional(),
  email: z.unknown().optional(),
  avatar_path: z.unknown().optional(),
  full_name: z.unknown().optional(),
});

export const zValidationError = z.object({
  loc: z.array(z.unknown()),
  msg: z.string(),
  type: z.string(),
});