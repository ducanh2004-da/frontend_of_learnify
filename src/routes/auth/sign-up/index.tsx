import "./sign-up.scss";

import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import { requireGuest } from "@/utils/authGuard";

export const Route = createFileRoute("/auth/sign-up/")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    requireGuest({ user, isAuthenticated: !!user });
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
        title: "Sign Up - Learnify",
      },
    ],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
