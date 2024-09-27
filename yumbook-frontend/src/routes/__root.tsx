import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import { Toaster } from "~/components/ui/toaster";

const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          <routerDevtools.TanStackRouterDevtools position="top-right" />
          <reactQueryDevtools.ReactQueryDevtools />
        </>
      ),
    };
  });

const TanStackDevtools =
  process.env.NODE_ENV === "production" ? () => null : lazy(loadDevtools);

export const Route = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
      <Toaster />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
});
