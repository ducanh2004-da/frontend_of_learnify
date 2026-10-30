import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";

export const Route = createFileRoute("/learner/user")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    if (!user)
      throw redirect({
        to: "/auth/log-in",
        search: { redirect: "/learner/user" },
      });
    return { user };
  },
  component: () => <Outlet />,
});
