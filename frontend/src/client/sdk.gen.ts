// This file is auto-generated by @hey-api/openapi-ts

import {
  createClient,
  createConfig,
  type Options,
  urlSearchParamsBodySerializer,
} from "@hey-api/client-fetch";
import type {
  LoginAccessTokenData,
  LoginAccessTokenError,
  LoginAccessTokenResponse,
  CreateUserData,
  CreateUserError,
  CreateUserResponse,
} from "./types.gen";
import { zLoginAccessTokenResponse, zCreateUserResponse } from "./zod.gen";

export const client = createClient(createConfig());

/**
 * Login Access Token
 * OAuth2 compatible token login, get an access token for future requests
 */
export const loginAccessToken = <ThrowOnError extends boolean = false>(
  options: Options<LoginAccessTokenData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    LoginAccessTokenResponse,
    LoginAccessTokenError,
    ThrowOnError
  >({
    ...options,
    ...urlSearchParamsBodySerializer,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...options?.headers,
    },
    responseValidator: async (data) => {
      return await zLoginAccessTokenResponse.parseAsync(data);
    },
    url: "/api/v1/login/access-token",
  });
};

/**
 * Create User
 */
export const createUser = <ThrowOnError extends boolean = false>(
  options: Options<CreateUserData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    CreateUserResponse,
    CreateUserError,
    ThrowOnError
  >({
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    responseValidator: async (data) => {
      return await zCreateUserResponse.parseAsync(data);
    },
    url: "/api/v1/users/",
  });
};
