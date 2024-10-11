import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";

import { client } from "./client";
import "./index.css";
import { useThemeStore } from "./hooks/use-theme";
import { useUserStore } from "./hooks/use-user";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree, defaultViewTransition: true });
export const queryClient = new QueryClient();
client.setConfig({ baseUrl: "http://localhost:8000", credentials: "include" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { initializeTheme } = useThemeStore();
  const { initializeUser } = useUserStore();

  // Initialize theme and user when the component mounts
  useEffect(() => {
    initializeTheme();
    initializeUser();
  }, [initializeTheme, initializeUser]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} defaultPreload={"intent"} />
      </QueryClientProvider>
    </StrictMode>
  );
}
