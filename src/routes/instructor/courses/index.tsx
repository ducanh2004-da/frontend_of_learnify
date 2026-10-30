import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor/courses/")({
  head: () => ({
    meta: [{ title: "Manage Courses | Instructor | Learnify" }],
  }),
});
