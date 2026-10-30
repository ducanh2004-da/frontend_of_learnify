import { getCurrentUserFn } from "@/server/auth";
import { createLearnerHead } from "@/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().catch(""),
  courseType: z.enum(["free", "paid"]).optional().catch(undefined),
  duration: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/learner/courses/")({
  validateSearch: searchSchema,
  beforeLoad: async ({ location }) => {
    const { user } = await getCurrentUserFn();
    if (!user)
      throw redirect({
        to: "/auth/log-in",
        search: { redirect: location.pathname },
      });
  },
  head: () => createLearnerHead("Courses"),
});
