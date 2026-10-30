import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import "./route.scss";
import TopNav from "@/components/TopNav";
import { createLearnerHead } from "@/utils";
import CourseController from "./-components/CourseController";
import { getCurrentUserFn } from "@/server/auth";

export const Route = createFileRoute("/learner_/lessons")({
  beforeLoad: async ({ location }) => {
    const { user, expired } = await getCurrentUserFn();
    if (expired && typeof window !== "undefined") {
      toast.error("Session expired. Please log in again.");
    }
    if (!user)
      throw redirect({
        to: "/auth/log-in",
        search: { redirect: location.pathname },
      });
    return { user };
  },
  component: RouteComponent,
  head: () => ({
    ...createLearnerHead("Lessons"),
  }),
});

function RouteComponent() {
  return (
    <section className="lesson-page">
      <TopNav fullWidth />
      <CourseController />
      <Outlet />
    </section>
  );
}
