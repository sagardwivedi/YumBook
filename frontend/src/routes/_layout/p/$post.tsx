import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/p/$post")({
  component: RouteComponent,
});

function RouteComponent() {
  const { post } = Route.useParams();
  return `Hello /_layout/posts/${post}!`;
}
