import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/recover-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/recover-password"!</div>
}
