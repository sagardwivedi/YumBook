import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/explorer")({
  component: () => <div>Hello /_layout/explorer!</div>,
});
