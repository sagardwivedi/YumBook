import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/message")({
  component: () => <div>Hello /_layout/message!</div>,
});
