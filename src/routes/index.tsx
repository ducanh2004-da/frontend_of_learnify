import { getCurrentUserFn } from "@/server/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "@/routes/-components/LandingPage";
import {
  MarketingErrorComponent,
  MarketingNotFoundComponent,
  MarketingPendingComponent,
} from "@/utils/marketing";
import { seo } from "@/utils/seo";
import { getRoleDefaultRoute, normalizeRole } from "@/utils/role";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    if (user) {
      throw redirect({ to: getRoleDefaultRoute(normalizeRole(user.role)) });
    }
  },
  errorComponent: MarketingErrorComponent,
  pendingComponent: MarketingPendingComponent,
  notFoundComponent: MarketingNotFoundComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "Learnify | Smart Learning. Real Skills. Ready Careers.",
        description:
          "Learnify is an educational platform that combines AI-powered 3D lecturers with hands-on labs. Built for learners, instructors, and academic institutions.",
      }),
    ],
  }),
  component: LandingPage,
});
