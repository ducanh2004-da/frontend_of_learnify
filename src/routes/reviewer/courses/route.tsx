import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/reviewer/courses")({
  head: () => ({
    meta: [{ title: "Manage Courses | Content Reviewer | Learnify" }],
  }),
  component: ReviewerCoursesLayout,
});

function ReviewerCoursesLayout() {
  return <Outlet />;
}
