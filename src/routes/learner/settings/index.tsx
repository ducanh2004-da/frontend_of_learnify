import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import { createLearnerHead } from "@/utils";

export const Route = createFileRoute("/learner/settings/")({
  beforeLoad: async ({ location }) => {
    const { user } = await getCurrentUserFn();
    if (!user)
      throw redirect({
        to: "/auth/log-in",
        search: { redirect: location.pathname },
      });
  },
  head: () => ({
    ...createLearnerHead("Settings"),
  }),
});
