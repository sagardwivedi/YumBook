/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as AuthSignupImport } from './routes/auth/signup'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as LayoutHomeImport } from './routes/_layout/home'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AuthSignupRoute = AuthSignupImport.update({
  id: '/auth/signup',
  path: '/auth/signup',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const LayoutHomeRoute = LayoutHomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/home': {
      id: '/_layout/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof LayoutHomeImport
      parentRoute: typeof LayoutImport
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/auth/signup': {
      id: '/auth/signup'
      path: '/auth/signup'
      fullPath: '/auth/signup'
      preLoaderRoute: typeof AuthSignupImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutHomeRoute: typeof LayoutHomeRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutHomeRoute: LayoutHomeRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '': typeof LayoutRouteWithChildren
  '/home': typeof LayoutHomeRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/signup': typeof AuthSignupRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '': typeof LayoutRouteWithChildren
  '/home': typeof LayoutHomeRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/signup': typeof AuthSignupRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/home': typeof LayoutHomeRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/signup': typeof AuthSignupRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/home' | '/auth/login' | '/auth/signup'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/home' | '/auth/login' | '/auth/signup'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/_layout/home'
    | '/auth/login'
    | '/auth/signup'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  LayoutRoute: typeof LayoutRouteWithChildren
  AuthLoginRoute: typeof AuthLoginRoute
  AuthSignupRoute: typeof AuthSignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  LayoutRoute: LayoutRouteWithChildren,
  AuthLoginRoute: AuthLoginRoute,
  AuthSignupRoute: AuthSignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_layout",
        "/auth/login",
        "/auth/signup"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/home"
      ]
    },
    "/_layout/home": {
      "filePath": "_layout/home.tsx",
      "parent": "/_layout"
    },
    "/auth/login": {
      "filePath": "auth/login.tsx"
    },
    "/auth/signup": {
      "filePath": "auth/signup.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
