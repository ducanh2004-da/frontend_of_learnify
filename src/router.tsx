import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import DefaultCatchBoundary from "./components/DefaultCatchBoundary";
import NotFound from "./components/NotFound";
export type TSessionUser = {
  id: string;
  email: string;
  username?: string;
  role?: string;
  diamond?: number;
  currentSteak?: number;
  subscription?: TSubscription["type"];
};
import type { TSubscription } from "./routes/learner/subscriptions/-types/type";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, auth: null },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    user: TSessionUser | null;
    isAuthenticated: boolean;
  } | null;
}
