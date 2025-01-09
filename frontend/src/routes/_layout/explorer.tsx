import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/explorer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/explorer"!</div>
}
