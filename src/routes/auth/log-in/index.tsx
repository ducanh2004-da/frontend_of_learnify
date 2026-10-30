import "./log-in.scss";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { createLearnerHead } from "@/utils";
import { getCurrentUserFn } from "@/server/auth";
import z from "zod";

const productSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth/log-in/")({
  validateSearch: productSearchSchema,
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    if (user) throw redirect({ to: "/learner" });
  },
  head: () => ({
    ...createLearnerHead("Log in"),
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
