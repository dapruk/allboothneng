import { Toaster } from "@/components/ui/sonner";
import QueryClientProvider from "./query-client-provider";
import RouterProvider from "./router-provider";

export default function AppProviders() {
  return (
    <QueryClientProvider>
      <RouterProvider />
      <Toaster />
    </QueryClientProvider>
  );
}
