import { createFileRoute } from "@tanstack/react-router";
import { createLearnerHead } from "@/utils";

export const Route = createFileRoute("/learner/shop/")({
  head: () => createLearnerHead("Shop"),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
