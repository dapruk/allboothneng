import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordFn } from "@/services/auth";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/types/auth";

export const Route = createFileRoute("/_auth/forgot-password/")({
  component: RouteComponent,
  staticData: {
    title: "Forgot Password",
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useForgotPasswordFn();

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordSchema) {
    const { error } = await forgotPassword(data.email);

    if (error) {
      toast.error(error.message as string);
    } else {
      toast.success("Email sent successfully");
      navigate({ to: "/login" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g. hallwack@gmail.com"
                    type="email"
                    {...field}
                  />
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
