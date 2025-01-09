import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { client } from "./client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// setup client sdk
client.setConfig({
  baseUrl: "http://localhost:8000",
});

// setup tanstack query
export const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultViewTransition: true,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
