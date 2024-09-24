import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

import '~/index.css';
import { routeTree } from '~/routeTree.gen';
import { client } from '~/client';
import useUser from '~/hooks/use-user';

const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    isAuthenticated: undefined!,
  },
  defaultViewTransition: true,
});

const queryClient = new QueryClient();

client.setConfig({ baseUrl: 'http://localhost:8000', credentials: 'include' });

declare module '@tanstack/react-router' {
  interface Register {
    rourer: typeof router;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

function Provider() {
  const { isAuthenticated } = useUser();

  return (
    <RouterProvider
      router={router}
      context={{ isAuthenticated }}
      defaultPreload={'intent'}
    />
  );
}
