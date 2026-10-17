import RouterComponentHolder from "@/components/RouterComponentHolder";
import "./courses.scss";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";

const searchSchema = z.object({
  tab: z
    .enum(["All", "Pending", "Published", "Rejected"])
    .optional()
    .default("All"),
  skip: z.number().optional().default(0),
  courseId: z.string().optional(),
});

export const Route = createFileRoute("/reviewer/courses/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Course Review Management | Content Reviewer | Learnify" }],
  }),
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
