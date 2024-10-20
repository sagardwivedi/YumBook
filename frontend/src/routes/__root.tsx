import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import NotFound from "~/components/NotFound";

const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          <routerDevtools.TanStackRouterDevtools />
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
      <Outlet />
      <ScrollRestoration />
      {/* <Suspense>
        <TanStackDevtools />
      </Suspense> */}
    </>
  ),
  notFoundComponent: NotFound,
});
