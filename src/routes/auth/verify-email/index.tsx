import "./verify-email.scss";

import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import { requireGuest } from "@/utils/authGuard";

type VerifyEmailSearch = { token?: string; email?: string };

export const Route = createFileRoute("/auth/verify-email/")({
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    requireGuest({ user, isAuthenticated: !!user });
  },
  head: () => ({
    meta: [{ title: "Verify Email - Learnify" }],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
