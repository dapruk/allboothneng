import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import AuthLayout from "@/components/layout/auth-layout";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/_auth")({
  component: AuthLayoutComponent,
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated && context.auth.isSignedIn) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      });
    }
  },
});

function AuthLayoutComponent() {
  const auth = useAuth();

  if (auth.isAuthenticated && auth.isSignedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
