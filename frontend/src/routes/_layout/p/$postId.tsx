import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/p/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/p/$postId"!</div>
}
