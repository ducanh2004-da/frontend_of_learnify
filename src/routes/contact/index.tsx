import "./contact.scss";

import {
  MarketingErrorComponent,
  MarketingNotFoundComponent,
  MarketingPendingComponent,
} from "@/utils/marketing";
import { seo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact/")({
  errorComponent: MarketingErrorComponent,
  pendingComponent: MarketingPendingComponent,
  notFoundComponent: MarketingNotFoundComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "Contact | Learnify",
        description:
          "Get in touch with the Learnify team. We'd love to hear from you.",
      }),
    ],
  }),
}).lazy(() => import("./index.lazy").then((m) => m.Route));
