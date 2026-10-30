import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor/courses")({
  head: () => ({
    meta: [{ title: "My Courses | Instructor | Learnify" }],
  }),
  component: InstructorCoursesLayout,
});

function InstructorCoursesLayout() {
  return <Outlet />;
}
