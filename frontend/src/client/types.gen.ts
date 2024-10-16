// This file is auto-generated by @hey-api/openapi-ts

export type Body_auth_login_user = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type ErrorResponse = {
  detail: string;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type SuccessResponse = {
  detail: string;
};

export type SuccessResponseWithData = {
  detail: string;
  data: {
    [key: string]: unknown;
  };
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
};

export type UserPublic = {
  username: string;
  profile_picture?: string;
  id: string;
};

export type UserRead = {
  username: string;
  profile_picture?: string;
  id: string;
  email: string;
};

export type UserUpdate = {
  username?: string | null;
  profile_picture?: string | null;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type RegisterUserData = {
  body: UserCreate;
};

export type RegisterUserResponse = SuccessResponse;

export type RegisterUserError = ErrorResponse | HTTPValidationError;

export type LoginUserData = {
  body: Body_auth_login_user;
};

export type LoginUserResponse = SuccessResponse;

export type LoginUserError = ErrorResponse | HTTPValidationError;

export type LogoutUserResponse = SuccessResponse;

export type LogoutUserError = ErrorResponse;

export type ForgotPasswordData = {
  query: {
    email: string;
  };
};

export type ForgotPasswordResponse = SuccessResponseWithData;

export type ForgotPasswordError = ErrorResponse | HTTPValidationError;

export type ResetPasswordData = {
  query: {
    new_password: string;
    token: string;
  };
};

export type ResetPasswordResponse = SuccessResponse;

export type ResetPasswordError = ErrorResponse | HTTPValidationError;

export type ReadMeResponse = UserRead;

export type ReadMeError = ErrorResponse;

export type UpdateProfileData = {
  body: UserUpdate;
};

export type UpdateProfileResponse = unknown;

export type UpdateProfileError = HTTPValidationError;

export type ReadOtherUserData = {
  path: {
    username: string;
  };
};

export type ReadOtherUserResponse = UserPublic;

export type ReadOtherUserError = ErrorResponse | HTTPValidationError;
