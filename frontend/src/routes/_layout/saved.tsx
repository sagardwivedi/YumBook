import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/saved"!</div>
}
