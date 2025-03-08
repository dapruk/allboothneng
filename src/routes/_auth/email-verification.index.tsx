import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/email-verification/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/email-verification/"!</div>
}
