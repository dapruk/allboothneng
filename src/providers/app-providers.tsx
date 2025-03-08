import { Toaster } from "@/components/ui/sonner";
import QueryClientProvider from "./query-client-provider";
import RouterProvider from "./router-provider";
import { AuthProvider } from "./auth-provider";

export default function AppProviders() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <RouterProvider />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
