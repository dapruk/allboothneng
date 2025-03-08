import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/about/')({
  component: LandingAboutPageComponent,
})

function LandingAboutPageComponent() {
  return <section>This is About Us!</section>
}
