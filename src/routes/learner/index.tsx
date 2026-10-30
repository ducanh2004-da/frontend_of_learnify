import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import "./home.scss";

export const Route = createFileRoute("/learner/")({
  beforeLoad: async ({ location }) => {
    const { user } = await getCurrentUserFn();
    if (user)
      throw redirect({
        to: "/learner/dashboard",
        search: { redirect: location.pathname },
      });
    return { user };
  },
}).lazy(() => import("./index.lazy").then((m) => m.Route));
