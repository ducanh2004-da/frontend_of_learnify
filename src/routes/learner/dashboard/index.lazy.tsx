import "./dashboard.scss";

import Card from "@/components/Card";
import TetrisLoader from "@/components/TetrisLoader";
import {
  useSuspenseGetAllCourses,
  type TBackendCourse,
} from "@/hooks/useCourses";
import { useLearnerProgress } from "@/hooks/useCourseDetail";
import { MOCK_COURSES } from "@/mock";
import { useAuthStore } from "@/store";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React, { Suspense } from "react";
import DashboardAchievementsWidget from "../-components/DashboardAchievementsWidget";
import DashboardBanner from "../-components/DashboardBanner";
import DashboardProgressWidget from "../-components/DashboardProgressWidget";
import DashboardStreakWidget from "../-components/DashboardStreakWidget";

export const Route = createLazyFileRoute("/learner/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseGetAllCourses(0);
  const navigate = useNavigate();
  const isBackendSuccess = data?.isSuccess && data.courses.length > 0;
  const user = useAuthStore((s) => s.user);
  const { data: progress } = useLearnerProgress(user?.id);

  const displayCourse = isBackendSuccess
    ? data.courses.map((course: TBackendCourse) => ({
        id: course.id,
        typeSpecial: "course" as const,
        title: course.courseName,
        description: course.abstract,
        duration: 45,
        status: "default" as const,
        percentage: 0,
        badgeStatus: (course.status === "Published" ? "public" : "private") as
          | "public"
          | "private",
      }))
    : MOCK_COURSES;

  return (
    <div className="dashboard">
      <Suspense fallback={<TetrisLoader size="md" />}>
        <div className="dashboard__main">
          <DashboardBanner />
          <div className="dashboard__main-courses">
            {displayCourse.map((course, index) => (
              <React.Fragment key={course.id}>
                <Card
                  typeSpecial={course.typeSpecial}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  status={course.status}
                  percentage={course.percentage}
                  badgeStatus={course.badgeStatus}
                  onClick={() =>
                    navigate({
                      to: "/learner/courses/$courseId",
                      params: { courseId: course.id.toString() },
                    })
                  }
                />
                {(index + 1) % 3 === 0 &&
                  index !== displayCourse.length - 1 && (
                    <hr className="dashboard__row-divider" />
                  )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="dashboard__sidebar">
          <div className="dashboard__sidebar-widget">
            <DashboardStreakWidget />
          </div>
          <div className="dashboard__sidebar-widget">
            <DashboardAchievementsWidget />
          </div>
          <div className="dashboard__sidebar-widget">
            <DashboardProgressWidget
              completedCourses={progress?.completedCoursesCount ?? 0}
              completedLessons={progress?.completedLessonsCount ?? 0}
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
