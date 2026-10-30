import "./style.scss";

import GraphqlError from "@/components/GraphqlError";
import LeftNav from "@/components/LeftNav";
import RouterComponentHolder from "@/components/RouterComponentHolder";
import TetrisLoader from "@/components/TetrisLoader";
import TopNav from "@/components/TopNav";
import { getCurrentUserFn } from "@/server/auth";
import { requireRole } from "@/utils/authGuard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { user, expired } = await getCurrentUserFn();
    requireRole("admin")({ user, isAuthenticated: !!user, expired });
  },
  head: () => ({
    meta: [{ title: "Admin | Learnify" }],
  }),
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <RouterComponentHolder children={<GraphqlError error={error} />} />
  ),
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
});

function AdminLayout() {
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
        </div>
      </article>
    </>
  );
}
