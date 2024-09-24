import {
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

import { Toaster } from '~/components/ui/toaster';
import type useUser from '~/hooks/use-user';

interface MyContext {
  isAuthenticated: boolean;
}

const loadDevtools = () =>
  Promise.all([
    import('@tanstack/router-devtools'),
    import('@tanstack/react-query-devtools'),
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
  process.env.NODE_ENV === 'production' ? () => null : lazy(loadDevtools);

export const Route = createRootRouteWithContext<MyContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
});
