import {
  createRouter,
  RouterProvider as RouterProviderBase,
} from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { CustomMetadataProps } from "./metadata-provider";
import { useAuth } from "./auth-provider";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption extends CustomMetadataProps {}
}

export default function RouterProvider() {
  const auth = useAuth();

  return (
    <RouterProviderBase
      router={router}
      defaultPreload="intent"
      context={{ auth }}
    />
  );
}
