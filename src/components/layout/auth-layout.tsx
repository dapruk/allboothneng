import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { Link } from "@tanstack/react-router";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-8 items-center">
            <p className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>

            <Link
              to="/"
              className="text-balance text-center text-sm text-primary underline underline-offset-4"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
