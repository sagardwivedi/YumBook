import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/accounts/edit")({
  component: () => <div>Hello /_layout/accounts/edit!</div>,
});
