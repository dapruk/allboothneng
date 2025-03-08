import LandingLayout from "@/components/layout/landing-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing")({
  component: LandingLayoutComponent,
});

function LandingLayoutComponent() {
  return (
    <LandingLayout>
      <main className="w-full px-4 py-6">
        <Outlet />
      </main>
    </LandingLayout>
  );
}
