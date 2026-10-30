import "./route.scss";

import LearnerErrorComponent from "./-components/LearnerErrorComponent";

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

import { getCurrentUserFn } from "@/server/auth";
import { createLearnerHead } from "@/utils";
import { requireAuth } from "@/utils/authGuard";

import Footer from "@/components/Footer";
import LeftNav from "@/components/LeftNav";
import NotFound from "@/components/NotFound";
import RouterComponentHolder from "@/components/RouterComponentHolder";
import TetrisLoader from "@/components/TetrisLoader";
import TopNav from "@/components/TopNav";

export const Route = createFileRoute("/learner")({
  beforeLoad: async () => {
    const { user, expired } = await getCurrentUserFn();
    requireAuth({ user, isAuthenticated: !!user, expired });
  },
  head: () => ({
    ...createLearnerHead("Home"),
  }),
  component: LearnerLayout,
  errorComponent: ({ error }) => (
    <RouterComponentHolder children={<LearnerErrorComponent error={error} />} />
  ),
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
});

function LearnerLayout() {
  return (
    <>
      <LeftNav />
      <article className="body">
        <TopNav />
        <div className="inner">
          <div className="content">
            <Suspense fallback={<TetrisLoader />}>
              <Outlet />
            </Suspense>
          </div>
          <Footer />
        </div>
      </article>
    </>
  );
}
