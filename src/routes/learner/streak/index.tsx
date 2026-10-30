import { createFileRoute } from "@tanstack/react-router";
import { createLearnerHead } from "@/utils";

export const Route = createFileRoute("/learner/streak/")({
  head: () => createLearnerHead("Streak"),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
