import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";

import { client } from "./client";
import { useThemeStore } from "./hooks/use-theme";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultViewTransition: true,
  defaultPreload: "intent",
});

export const queryClient = new QueryClient();

client.setConfig({ baseUrl: "http://localhost:8000", credentials: "include" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
