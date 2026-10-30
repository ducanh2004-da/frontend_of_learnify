import "./forgot-password.scss";

import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import { requireGuest } from "@/utils/authGuard";

export const Route = createFileRoute("/auth/forgot-password/")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    requireGuest({ user, isAuthenticated: !!user });
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
        title: "Forgot Password - Learnify",
      },
    ],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
