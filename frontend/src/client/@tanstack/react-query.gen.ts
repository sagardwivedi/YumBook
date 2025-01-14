// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from "@hey-api/client-fetch";
import { queryOptions, type UseMutationOptions } from "@tanstack/react-query";
import type {
  LoginAccessTokenData,
  LoginAccessTokenError,
  LoginAccessTokenResponse,
  CreateUserData,
  CreateUserError,
  CreateUserResponse,
} from "../types.gen";
import { loginAccessToken, createUser, client } from "../sdk.gen";

type QueryKey<TOptions extends Options> = [
  Pick<TOptions, "baseUrl" | "body" | "headers" | "path" | "query"> & {
    _id: string;
    _infinite?: boolean;
  },
];

const createQueryKey = <TOptions extends Options>(
  id: string,
  options?: TOptions,
  infinite?: boolean,
): QueryKey<TOptions>[0] => {
  const params: QueryKey<TOptions>[0] = {
    _id: id,
    baseUrl: (options?.client ?? client).getConfig().baseUrl,
  } as QueryKey<TOptions>[0];
  if (infinite) {
    params._infinite = infinite;
  }
  if (options?.body) {
    params.body = options.body;
  }
  if (options?.headers) {
    params.headers = options.headers;
  }
  if (options?.path) {
    params.path = options.path;
  }
  if (options?.query) {
    params.query = options.query;
  }
  return params;
};

export const loginAccessTokenQueryKey = (
  options: Options<LoginAccessTokenData>,
) => [createQueryKey("loginAccessToken", options)];

export const loginAccessTokenOptions = (
  options: Options<LoginAccessTokenData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await loginAccessToken({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: loginAccessTokenQueryKey(options),
  });
};

export const loginAccessTokenMutation = (
  options?: Partial<Options<LoginAccessTokenData>>,
) => {
  const mutationOptions: UseMutationOptions<
    LoginAccessTokenResponse,
    LoginAccessTokenError,
    Options<LoginAccessTokenData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await loginAccessToken({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const createUserQueryKey = (options: Options<CreateUserData>) => [
  createQueryKey("createUser", options),
];

export const createUserOptions = (options: Options<CreateUserData>) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await createUser({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: createUserQueryKey(options),
  });
};

export const createUserMutation = (
  options?: Partial<Options<CreateUserData>>,
) => {
  const mutationOptions: UseMutationOptions<
    CreateUserResponse,
    CreateUserError,
    Options<CreateUserData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await createUser({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};
