import "./style.scss";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { useAuthStore } from "@/store";
import { useGetAllCourses, type TBackendCourse } from "@/hooks/useCourses";

import CubeLoader from "@/components/CubeLoader";
import Icon from "@/components/Icon";

export const Route = createFileRoute("/reviewer/")({
  head: () => ({
    meta: [{ title: "Dashboard | Content Reviewer | Learnify" }],
  }),
  component: ReviewerDashboard,
});

function ReviewerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useGetAllCourses(0);
  const courses = useMemo(() => data?.courses ?? [], [data]);

  const stats = useMemo(() => {
    const pending = courses.filter(
      (c: TBackendCourse) => c.status === "Pending"
    );
    const published = courses.filter(
      (c: TBackendCourse) => c.status === "Published"
    );
    const rejected = courses.filter(
      (c: TBackendCourse) => c.status === "Rejected"
    );
    return {
      total: courses.length,
      pending: pending.length,
      published: published.length,
      rejected: rejected.length,
      pendingCourses: pending.slice(0, 5),
    };
  }, [courses]);

  return (
    <div className="reviewer-dashboard">
      <div className="reviewer-dashboard__hero">
        <h1 className="reviewer-dashboard__title semibold">
          <Trans
            i18nKey="dashboard.welcome_title"
            values={{ name: user?.username ?? "Reviewer" }}
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h1>
        <p className="reviewer-dashboard__subtitle regular">
          {t("dashboard.welcome_subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="reviewer-dashboard__loader">
          <CubeLoader />
        </div>
      ) : (
        <div className="reviewer-dashboard__grid">
          <div className="reviewer-dashboard__main">
            <div className="reviewer-dashboard__stats">
              <div className="reviewer-dashboard__stat-card">
                <Icon
                  name="menu_book"
                  className="reviewer-dashboard__stat-icon"
                />
                <div className="reviewer-dashboard__stat-info">
                  <span className="reviewer-dashboard__stat-value">
                    {stats.total}
                  </span>
                  <span className="reviewer-dashboard__stat-label">
                    {t("dashboard.total_courses")}
                  </span>
                </div>
              </div>
              <div className="reviewer-dashboard__stat-card reviewer-dashboard__stat-card--pending">
                <Icon
                  name="hourglass_empty"
                  className="reviewer-dashboard__stat-icon"
                />
                <div className="reviewer-dashboard__stat-info">
                  <span className="reviewer-dashboard__stat-value">
                    {stats.pending}
                  </span>
                  <span className="reviewer-dashboard__stat-label">
                    {t("dashboard.pending")}
                  </span>
                </div>
              </div>
              <div className="reviewer-dashboard__stat-card reviewer-dashboard__stat-card--published">
                <Icon
                  name="check_circle"
                  className="reviewer-dashboard__stat-icon"
                />
                <div className="reviewer-dashboard__stat-info">
                  <span className="reviewer-dashboard__stat-value">
                    {stats.published}
                  </span>
                  <span className="reviewer-dashboard__stat-label">
                    {t("dashboard.published")}
                  </span>
                </div>
              </div>
              <div className="reviewer-dashboard__stat-card reviewer-dashboard__stat-card--rejected">
                <Icon name="cancel" className="reviewer-dashboard__stat-icon" />
                <div className="reviewer-dashboard__stat-info">
                  <span className="reviewer-dashboard__stat-value">
                    {stats.rejected}
                  </span>
                  <span className="reviewer-dashboard__stat-label">
                    {t("dashboard.rejected")}
                  </span>
                </div>
              </div>
            </div>

            <div className="reviewer-dashboard__pending-section">
              <h2 className="reviewer-dashboard__section-title semibold">
                {t("dashboard.pending_reviews")}
              </h2>
              {stats.pendingCourses.length > 0 ? (
                <div className="reviewer-dashboard__pending-list">
                  {stats.pendingCourses.map((course: TBackendCourse) => (
                    <div
                      key={course.id}
                      className="reviewer-dashboard__pending-item"
                      onClick={() =>
                        navigate({
                          to: "/reviewer/courses",
                          search: { courseId: course.id, tab: "Pending" },
                        })
                      }
                    >
                      <div className="reviewer-dashboard__pending-item-info">
                        <span className="reviewer-dashboard__pending-item-name medium">
                          {course.courseName}
                        </span>
                        <small className="reviewer-dashboard__pending-item-date">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <Icon name="chevron_right" size={20} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="reviewer-dashboard__empty">
                  {t("dashboard.no_courses")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
