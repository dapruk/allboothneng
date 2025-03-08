import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useResetPasswordFn } from "@/services/auth";
import { resetPasswordSchema, ResetPasswordSchema } from "@/types/auth";
import { supabaseClient } from "@/lib/supabase-client";

export const Route = createFileRoute("/_auth/reset-password/")({
  component: RouteComponent,
  staticData: {
    title: "Reset Password",
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useResetPasswordFn();

  const form = useForm<ResetPasswordSchema>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordSchema) {
    const { error } = await resetPassword(data.password);

    if (error) {
      toast.error(error.message as string);
    } else {
      toast.success("Password reset successfully");
    }
  }

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, _session) => {
      if (event !== "PASSWORD_RECOVERY") {
        navigate({ to: "/login" });
      }
    });
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            Send Reset Link to Email
          </Button>
        </div>
      </form>
    </Form>
  );
}
