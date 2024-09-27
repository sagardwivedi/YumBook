import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import '~/index.css';
import { client } from '~/client';
import { useThemeStore } from '~/hooks/use-theme-store';
import { routeTree } from '~/routeTree.gen';
import useUserStore from './hooks/use-user-store';

const router = createRouter({
  routeTree,
  defaultViewTransition: true,
});

export const queryClient = new QueryClient();

client.setConfig({ baseUrl: 'http://localhost:8000', credentials: 'include' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}

function App() {
  const { initializeTheme } = useThemeStore();
  const { initializeUser } = useUserStore();

  useEffect(() => {
    initializeTheme(); // Initialize theme when the component mounts
    initializeUser();
  }, [initializeTheme, initializeUser]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} defaultPreload={'intent'} />
      </QueryClientProvider>
    </StrictMode>
  );
}
