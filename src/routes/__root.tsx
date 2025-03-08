import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MetadataProvider } from "@/providers/metadata-provider";
import { AuthContextType } from "@/providers/auth-provider";

export const Route = createRootRouteWithContext<{
  auth: AuthContextType;
}>()({
  /* beforeLoad: async ({ context }) => {
    await context.auth.client.auth.initialize();
  }, */
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <MetadataProvider>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        {/* <ReactQueryDevtools buttonPosition="bottom-right" /> */}
      </MetadataProvider>
    </React.Fragment>
  );
}
