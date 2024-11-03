import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/$recipe")({
  component: () => <div>Hello /_layout/$recipe!</div>,
});
