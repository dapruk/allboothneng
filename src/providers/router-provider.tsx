import {
  createRouter,
  RouterProvider as RouterProviderBase,
} from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { CustomMetadataProps } from "./metadata-provider";

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
  return <RouterProviderBase router={router} defaultPreload="intent" />;
}
