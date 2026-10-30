import "./subscriptions.scss";

import { createFileRoute } from "@tanstack/react-router";
import { createLearnerHead } from "@/utils";

export const Route = createFileRoute("/learner/subscriptions/")({
  head: () => createLearnerHead("Subscriptions"),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
