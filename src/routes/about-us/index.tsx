import "./about-us.scss";

import {
  MarketingErrorComponent,
  MarketingNotFoundComponent,
  MarketingPendingComponent,
} from "@/utils/marketing";
import { seo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about-us/")({
  errorComponent: MarketingErrorComponent,
  pendingComponent: MarketingPendingComponent,
  notFoundComponent: MarketingNotFoundComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "About Us | Learnify",
        description:
          "Learnify is an educational platform that combines AI-powered 3D lecturers with hands-on labs. Built for learners, instructors, and academic institutions.",
      }),
    ],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
