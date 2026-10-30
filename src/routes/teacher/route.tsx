import Footer from "@/components/Footer";
import LeftNav from "@/components/LeftNav";
import TetrisLoader from "@/components/TetrisLoader";
import TopNav from "@/components/TopNav";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import "./style.scss";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [{ title: "Teacher | Learnify" }],
  }),
  component: TeacherLayout,
});

function TeacherLayout() {
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
