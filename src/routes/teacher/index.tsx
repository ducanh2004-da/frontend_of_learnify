import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import Search from "@/components/Search";
import TextButton from "@/components/TextButton";
import "./style.scss";

export const Route = createFileRoute("/teacher/")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    return { user };
  },
  component: TeacherHome,
});

function TeacherHome() {
  const navigate = useNavigate();

  return (
    <div className="teacher-home">
      <div className="teacher-home__hero">
        <h1 className="teacher-home__title semibold">
          Welcome to the <span className="beauty">Teacher Dashboard</span>
        </h1>
        <p className="teacher-home__subtitle regular">
          Create courses, manage students, and track learning progress.
        </p>
      </div>
      <Search placeholder="Search your courses..." />
      <div className="teacher-home__actions">
        <TextButton
          text="Create Course"
          size="medium"
          icon="add"
          onClick={() => {}}
        />
        <TextButton
          text="Manage Courses"
          size="medium"
          type="outlined"
          icon="book"
          onClick={() =>
            navigate({
              to: "/learner/courses",
              search: { q: "" },
            })
          }
        />
        <TextButton
          text="Switch to Learner"
          size="medium"
          type="outlined"
          icon="school"
          onClick={() =>
            navigate({
              to: "/learner",
            })
          }
        />
      </div>
    </div>
  );
}
