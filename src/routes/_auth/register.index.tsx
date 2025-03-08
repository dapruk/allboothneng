import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "@/components/register-form";

export const Route = createFileRoute("/_auth/register/")({
  component: AuthRegisterPageComponent,
  staticData: {
    title: "Register",
  },
});

function AuthRegisterPageComponent() {
  return <RegisterForm />;
}
