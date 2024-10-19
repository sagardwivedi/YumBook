import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/activity")({
  component: () => <div>Hello /_layout/notification!</div>,
});
