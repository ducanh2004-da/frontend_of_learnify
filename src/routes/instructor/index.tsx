import { createFileRoute } from "@tanstack/react-router";
import { useTranslation, Trans } from "react-i18next";
import { useAuthStore } from "@/store";
import { useInstructorDashboard } from "@/hooks/useCourses";
import CubeLoader from "@/components/CubeLoader";
import StatCard from "./-components/StatCard";
import RecentCourses from "./-components/RecentCourses";
import QuickActions from "./-components/QuickActions";
import "./style.scss";

export const Route = createFileRoute("/instructor/")({
  component: InstructorHome,
});

function InstructorHome() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useInstructorDashboard(user?.id ?? "");

  return (
    <div className="instructor-home">
      <div className="instructor-home__hero">
        <h1 className="instructor-home__title semibold">
          <Trans
            i18nKey="dashboard.welcome_title"
            values={{ name: user?.username ?? "Instructor" }}
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h1>
        <p className="instructor-home__subtitle regular">
          {t("dashboard.welcome_subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="instructor-home__loader">
          <CubeLoader />
        </div>
      ) : data ? (
        <div className="instructor-home__grid">
          <div className="instructor-home__main">
            <div className="instructor-home__stats">
              <StatCard
                icon="menu_book"
                label={t("dashboard.total_courses")}
                value={data.totalCourses}
                accent="var(--color-green-600)"
              />
              <StatCard
                icon="check_circle"
                label={t("dashboard.published")}
                value={data.publishedCount}
                accent="var(--color-accent-emerald)"
              />
              <StatCard
                icon="description"
                label={t("dashboard.pending")}
                value={data.pendingCount}
                accent="var(--color-mode-yellow)"
              />
              <StatCard
                icon="school"
                label={t("dashboard.total_lessons")}
                value={data.totalLessons}
                accent="var(--color-accent-blue-celeste)"
              />
            </div>
            <RecentCourses courses={data.recentCourses} />
          </div>
          <aside className="instructor-home__sidebar">
            <QuickActions />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
