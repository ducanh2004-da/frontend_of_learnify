import "./blogs.scss";

import {
  MarketingErrorComponent,
  MarketingNotFoundComponent,
  MarketingPendingComponent,
} from "@/utils/marketing";
import { seo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs/")({
  errorComponent: MarketingErrorComponent,
  pendingComponent: MarketingPendingComponent,
  notFoundComponent: MarketingNotFoundComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "Blogs | Learnify",
        description:
          "Insights, tutorials, and updates from the Learnify team on AI-powered education, 3D learning, and career development.",
      }),
    ],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
