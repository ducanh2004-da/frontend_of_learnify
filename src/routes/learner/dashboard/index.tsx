import RouterComponentHolder from "@/components/RouterComponentHolder";
import { getCurrentUserFn } from "@/server/auth";
import { createLearnerHead } from "@/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LearnerErrorComponent from "../-components/LearnerErrorComponent";
import TetrisLoader from "@/components/TetrisLoader";
import NotFound from "@/components/NotFound";

export const Route = createFileRoute("/learner/dashboard/")({
  beforeLoad: async ({ location }) => {
    const { user } = await getCurrentUserFn();
    if (!user)
      throw redirect({
        to: "/auth/log-in",
        search: { redirect: location.pathname },
      });
  },
  head: () => ({
    ...createLearnerHead("Dashboard"),
  }),
  errorComponent: () => (
    <RouterComponentHolder
      children={<LearnerErrorComponent error="Failed to load dashboard" />}
    />
  ),
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
});
