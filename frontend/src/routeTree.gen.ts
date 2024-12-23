/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as LayoutImport } from "./routes/_layout";
import { Route as IndexImport } from "./routes/index";
import { Route as AuthSignupImport } from "./routes/auth/signup";
import { Route as AuthResetPasswordImport } from "./routes/auth/reset-password";
import { Route as AuthForgotPasswordImport } from "./routes/auth/forgot-password";
import { Route as LayoutMessageImport } from "./routes/_layout/message";
import { Route as LayoutHomeImport } from "./routes/_layout/home";
import { Route as LayoutExplorerImport } from "./routes/_layout/explorer";
import { Route as LayoutCreateImport } from "./routes/_layout/create";
import { Route as LayoutActivityImport } from "./routes/_layout/activity";
import { Route as LayoutRecipeImport } from "./routes/_layout/$recipe";
import { Route as LayoutPPostImport } from "./routes/_layout/p/$post";
import { Route as LayoutAccountsEditImport } from "./routes/_layout/accounts/edit";
import { Route as LayoutAccountsProfileImport } from "./routes/_layout/accounts/$profile";

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: "/_layout",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const AuthSignupRoute = AuthSignupImport.update({
  id: "/auth/signup",
  path: "/auth/signup",
  getParentRoute: () => rootRoute,
} as any);

const AuthResetPasswordRoute = AuthResetPasswordImport.update({
  id: "/auth/reset-password",
  path: "/auth/reset-password",
  getParentRoute: () => rootRoute,
} as any);

const AuthForgotPasswordRoute = AuthForgotPasswordImport.update({
  id: "/auth/forgot-password",
  path: "/auth/forgot-password",
  getParentRoute: () => rootRoute,
} as any);

const LayoutMessageRoute = LayoutMessageImport.update({
  id: "/message",
  path: "/message",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutHomeRoute = LayoutHomeImport.update({
  id: "/home",
  path: "/home",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutExplorerRoute = LayoutExplorerImport.update({
  id: "/explorer",
  path: "/explorer",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutCreateRoute = LayoutCreateImport.update({
  id: "/create",
  path: "/create",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutActivityRoute = LayoutActivityImport.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutRecipeRoute = LayoutRecipeImport.update({
  id: "/$recipe",
  path: "/$recipe",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutPPostRoute = LayoutPPostImport.update({
  id: "/p/$post",
  path: "/p/$post",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutAccountsEditRoute = LayoutAccountsEditImport.update({
  id: "/accounts/edit",
  path: "/accounts/edit",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutAccountsProfileRoute = LayoutAccountsProfileImport.update({
  id: "/accounts/$profile",
  path: "/accounts/$profile",
  getParentRoute: () => LayoutRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout": {
      id: "/_layout";
      path: "";
      fullPath: "";
      preLoaderRoute: typeof LayoutImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout/$recipe": {
      id: "/_layout/$recipe";
      path: "/$recipe";
      fullPath: "/$recipe";
      preLoaderRoute: typeof LayoutRecipeImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/activity": {
      id: "/_layout/activity";
      path: "/activity";
      fullPath: "/activity";
      preLoaderRoute: typeof LayoutActivityImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/create": {
      id: "/_layout/create";
      path: "/create";
      fullPath: "/create";
      preLoaderRoute: typeof LayoutCreateImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/explorer": {
      id: "/_layout/explorer";
      path: "/explorer";
      fullPath: "/explorer";
      preLoaderRoute: typeof LayoutExplorerImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/home": {
      id: "/_layout/home";
      path: "/home";
      fullPath: "/home";
      preLoaderRoute: typeof LayoutHomeImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/message": {
      id: "/_layout/message";
      path: "/message";
      fullPath: "/message";
      preLoaderRoute: typeof LayoutMessageImport;
      parentRoute: typeof LayoutImport;
    };
    "/auth/forgot-password": {
      id: "/auth/forgot-password";
      path: "/auth/forgot-password";
      fullPath: "/auth/forgot-password";
      preLoaderRoute: typeof AuthForgotPasswordImport;
      parentRoute: typeof rootRoute;
    };
    "/auth/reset-password": {
      id: "/auth/reset-password";
      path: "/auth/reset-password";
      fullPath: "/auth/reset-password";
      preLoaderRoute: typeof AuthResetPasswordImport;
      parentRoute: typeof rootRoute;
    };
    "/auth/signup": {
      id: "/auth/signup";
      path: "/auth/signup";
      fullPath: "/auth/signup";
      preLoaderRoute: typeof AuthSignupImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout/accounts/$profile": {
      id: "/_layout/accounts/$profile";
      path: "/accounts/$profile";
      fullPath: "/accounts/$profile";
      preLoaderRoute: typeof LayoutAccountsProfileImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/accounts/edit": {
      id: "/_layout/accounts/edit";
      path: "/accounts/edit";
      fullPath: "/accounts/edit";
      preLoaderRoute: typeof LayoutAccountsEditImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/p/$post": {
      id: "/_layout/p/$post";
      path: "/p/$post";
      fullPath: "/p/$post";
      preLoaderRoute: typeof LayoutPPostImport;
      parentRoute: typeof LayoutImport;
    };
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutRecipeRoute: typeof LayoutRecipeRoute;
  LayoutActivityRoute: typeof LayoutActivityRoute;
  LayoutCreateRoute: typeof LayoutCreateRoute;
  LayoutExplorerRoute: typeof LayoutExplorerRoute;
  LayoutHomeRoute: typeof LayoutHomeRoute;
  LayoutMessageRoute: typeof LayoutMessageRoute;
  LayoutAccountsProfileRoute: typeof LayoutAccountsProfileRoute;
  LayoutAccountsEditRoute: typeof LayoutAccountsEditRoute;
  LayoutPPostRoute: typeof LayoutPPostRoute;
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutRecipeRoute: LayoutRecipeRoute,
  LayoutActivityRoute: LayoutActivityRoute,
  LayoutCreateRoute: LayoutCreateRoute,
  LayoutExplorerRoute: LayoutExplorerRoute,
  LayoutHomeRoute: LayoutHomeRoute,
  LayoutMessageRoute: LayoutMessageRoute,
  LayoutAccountsProfileRoute: LayoutAccountsProfileRoute,
  LayoutAccountsEditRoute: LayoutAccountsEditRoute,
  LayoutPPostRoute: LayoutPPostRoute,
};

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "": typeof LayoutRouteWithChildren;
  "/$recipe": typeof LayoutRecipeRoute;
  "/activity": typeof LayoutActivityRoute;
  "/create": typeof LayoutCreateRoute;
  "/explorer": typeof LayoutExplorerRoute;
  "/home": typeof LayoutHomeRoute;
  "/message": typeof LayoutMessageRoute;
  "/auth/forgot-password": typeof AuthForgotPasswordRoute;
  "/auth/reset-password": typeof AuthResetPasswordRoute;
  "/auth/signup": typeof AuthSignupRoute;
  "/accounts/$profile": typeof LayoutAccountsProfileRoute;
  "/accounts/edit": typeof LayoutAccountsEditRoute;
  "/p/$post": typeof LayoutPPostRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "": typeof LayoutRouteWithChildren;
  "/$recipe": typeof LayoutRecipeRoute;
  "/activity": typeof LayoutActivityRoute;
  "/create": typeof LayoutCreateRoute;
  "/explorer": typeof LayoutExplorerRoute;
  "/home": typeof LayoutHomeRoute;
  "/message": typeof LayoutMessageRoute;
  "/auth/forgot-password": typeof AuthForgotPasswordRoute;
  "/auth/reset-password": typeof AuthResetPasswordRoute;
  "/auth/signup": typeof AuthSignupRoute;
  "/accounts/$profile": typeof LayoutAccountsProfileRoute;
  "/accounts/edit": typeof LayoutAccountsEditRoute;
  "/p/$post": typeof LayoutPPostRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/_layout": typeof LayoutRouteWithChildren;
  "/_layout/$recipe": typeof LayoutRecipeRoute;
  "/_layout/activity": typeof LayoutActivityRoute;
  "/_layout/create": typeof LayoutCreateRoute;
  "/_layout/explorer": typeof LayoutExplorerRoute;
  "/_layout/home": typeof LayoutHomeRoute;
  "/_layout/message": typeof LayoutMessageRoute;
  "/auth/forgot-password": typeof AuthForgotPasswordRoute;
  "/auth/reset-password": typeof AuthResetPasswordRoute;
  "/auth/signup": typeof AuthSignupRoute;
  "/_layout/accounts/$profile": typeof LayoutAccountsProfileRoute;
  "/_layout/accounts/edit": typeof LayoutAccountsEditRoute;
  "/_layout/p/$post": typeof LayoutPPostRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | ""
    | "/$recipe"
    | "/activity"
    | "/create"
    | "/explorer"
    | "/home"
    | "/message"
    | "/auth/forgot-password"
    | "/auth/reset-password"
    | "/auth/signup"
    | "/accounts/$profile"
    | "/accounts/edit"
    | "/p/$post";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | ""
    | "/$recipe"
    | "/activity"
    | "/create"
    | "/explorer"
    | "/home"
    | "/message"
    | "/auth/forgot-password"
    | "/auth/reset-password"
    | "/auth/signup"
    | "/accounts/$profile"
    | "/accounts/edit"
    | "/p/$post";
  id:
    | "__root__"
    | "/"
    | "/_layout"
    | "/_layout/$recipe"
    | "/_layout/activity"
    | "/_layout/create"
    | "/_layout/explorer"
    | "/_layout/home"
    | "/_layout/message"
    | "/auth/forgot-password"
    | "/auth/reset-password"
    | "/auth/signup"
    | "/_layout/accounts/$profile"
    | "/_layout/accounts/edit"
    | "/_layout/p/$post";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  LayoutRoute: typeof LayoutRouteWithChildren;
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute;
  AuthResetPasswordRoute: typeof AuthResetPasswordRoute;
  AuthSignupRoute: typeof AuthSignupRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRouteWithChildren,
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthResetPasswordRoute: AuthResetPasswordRoute,
  AuthSignupRoute: AuthSignupRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();
