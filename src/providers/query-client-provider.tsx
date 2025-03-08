import React from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient();

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError
  }
}

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProviderBase client={queryClient}>
      {children}
    </QueryClientProviderBase>
  );
}
