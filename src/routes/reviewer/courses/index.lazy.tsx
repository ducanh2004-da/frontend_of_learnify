import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  useGetAllCourses,
  useGetCoursesByStatus,
  usePublishCourse,
  useRejectCourse,
  type TBackendCourse,
} from "@/hooks/useCourses";
import TetrisLoader from "@/components/TetrisLoader";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import "./courses.scss";

const PAGE_SIZE = 10;
const TABS = ["All", "Pending", "Published", "Rejected"] as const;
type TTab = (typeof TABS)[number];

export const Route = createLazyFileRoute("/reviewer/courses/")({
  component: ReviewerCoursesDashboardPage,
});

function ReviewerCoursesDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const activeTab: TTab = (search.tab as TTab) ?? "All";
  const skip = typeof search.skip === "number" ? search.skip : 0;

  // Data fetching based on active tab
  const allQuery = useGetAllCourses(skip);
  const statusQuery = useGetCoursesByStatus(
    activeTab !== "All" ? activeTab : "Pending",
    skip
  );

  const isAllTab = activeTab === "All";
  const activeQuery = isAllTab ? allQuery : statusQuery;
  const isLoading = activeQuery.isLoading;
  const courses: TBackendCourse[] = activeQuery.data?.courses ?? [];
  const totalCount = activeQuery.data?.count ?? 0;

  // Mutations
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: rejectCourse, isPending: isRejecting } = useRejectCourse();

  const handleTabChange = (tab: TTab) => {
    navigate({
      to: "/reviewer/courses",
      search: { tab, skip: 0 },
    });
  };

  const handlePrevPage = () => {
    if (skip - PAGE_SIZE >= 0) {
      navigate({
        to: "/reviewer/courses",
        search: { tab: activeTab, skip: skip - PAGE_SIZE },
      });
    }
  };

  const handleNextPage = () => {
    if (skip + PAGE_SIZE < totalCount) {
      navigate({
        to: "/reviewer/courses",
        search: { tab: activeTab, skip: skip + PAGE_SIZE },
      });
    }
  };

  return (
    <div className="reviewer-courses-dashboard">
      <header className="reviewer-courses-dashboard__header">
        <h1 className="reviewer-courses-dashboard__header-title">
          {t("courses.course_review_management", "Course Review Management")}
        </h1>
        <p className="reviewer-courses-dashboard__header-subtitle">
          {t(
            "courses.review_management_subtitle",
            "Review submitted courses, preview curriculum & section markdown, and approve or reject courses."
          )}
        </p>
      </header>

      {/* Status Filter Tabs */}
      <div className="reviewer-courses-dashboard__tabs" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`reviewer-courses-dashboard__tab-btn ${
                isActive ? "reviewer-courses-dashboard__tab-btn--active" : ""
              }`}
              onClick={() => handleTabChange(tab)}
            >
              <Icon
                name={
                  tab === "All"
                    ? "menu_book"
                    : tab === "Pending"
                      ? "hourglass_empty"
                      : tab === "Published"
                        ? "check_circle"
                        : "cancel"
                }
                size={18}
              />
              <span>{tab}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="reviewer-courses-dashboard__loader">
          <TetrisLoader />
        </div>
      ) : courses.length === 0 ? (
        <Empty>
          <Empty.Header>
            <Empty.Media variant="icon">
              <Icon name="search" size={40} />
            </Empty.Media>
            <Empty.Title>
              {t("courses.no_courses_in_tab", "No courses found")}
            </Empty.Title>
            <Empty.Description>
              {t(
                "courses.no_courses_tab_desc",
                `There are currently no courses with status "${activeTab}".`
              )}
            </Empty.Description>
          </Empty.Header>
        </Empty>
      ) : (
        <div className="reviewer-courses-dashboard__list">
          {courses.map((course) => {
            const statusKey = (course.status || "Pending").toLowerCase();
            const isPendingOrRejected =
              course.status === "Pending" || course.status === "Rejected";
            const isPendingOrPublished =
              course.status === "Pending" || course.status === "Published";

            const formattedCreatedDate = course.createdAt
              ? new Date(course.createdAt).toLocaleDateString()
              : "—";
            const formattedUpdatedDate = course.updatedAt
              ? new Date(course.updatedAt).toLocaleDateString()
              : null;

            return (
              <article
                key={course.id}
                className="reviewer-courses-dashboard__card"
              >
                <div className="reviewer-courses-dashboard__card-top">
                  <div className="reviewer-courses-dashboard__card-title-area">
                    <h2 className="reviewer-courses-dashboard__card-name">
                      {course.courseName}
                    </h2>
                  </div>
                  <span
                    className={`reviewer-courses-dashboard__status-badge reviewer-courses-dashboard__status-badge--${statusKey}`}
                  >
                    <Icon
                      name={
                        course.status === "Published"
                          ? "check_circle"
                          : course.status === "Rejected"
                            ? "cancel"
                            : "hourglass_empty"
                      }
                      size={14}
                    />
                    {course.status}
                  </span>
                </div>

                <p className="reviewer-courses-dashboard__card-abstract">
                  {course.abstract ||
                    t("courses.no_description", "No description provided.")}
                </p>

                <div className="reviewer-courses-dashboard__card-meta">
                  <span className="reviewer-courses-dashboard__card-meta-item">
                    <Icon name="calendar_today" size={14} />
                    <span>Created: {formattedCreatedDate}</span>
                  </span>
                  {formattedUpdatedDate && (
                    <span className="reviewer-courses-dashboard__card-meta-item">
                      <Icon name="schedule" size={14} />
                      <span>Updated: {formattedUpdatedDate}</span>
                    </span>
                  )}
                  {course.keyLearnings && course.keyLearnings.length > 0 && (
                    <span className="reviewer-courses-dashboard__card-meta-item">
                      <Icon name="school" size={14} />
                      <span>{course.keyLearnings.length} learning topics</span>
                    </span>
                  )}
                </div>

                <div className="reviewer-courses-dashboard__card-actions">
                  <Link
                    to="/reviewer/courses/$courseId"
                    params={{ courseId: course.id }}
                    className="reviewer-courses-dashboard__btn reviewer-courses-dashboard__btn--preview"
                  >
                    <Icon name="visibility" size={16} />
                    <span>
                      {t("courses.preview_content", "Preview Content")}
                    </span>
                  </Link>

                  {isPendingOrRejected && (
                    <button
                      type="button"
                      disabled={isPublishing}
                      className="reviewer-courses-dashboard__btn reviewer-courses-dashboard__btn--publish"
                      onClick={() => publishCourse(course.id)}
                    >
                      <Icon name="check_circle" size={16} />
                      <span>
                        {isPublishing ? "Publishing..." : "Approve / Publish"}
                      </span>
                    </button>
                  )}

                  {isPendingOrPublished && (
                    <button
                      type="button"
                      disabled={isRejecting}
                      className="reviewer-courses-dashboard__btn reviewer-courses-dashboard__btn--reject"
                      onClick={() => rejectCourse(course.id)}
                    >
                      <Icon name="cancel" size={16} />
                      <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalCount > PAGE_SIZE && (
        <div className="reviewer-courses-dashboard__pagination">
          <span className="reviewer-courses-dashboard__pagination-info">
            Showing {skip + 1} - {Math.min(skip + PAGE_SIZE, totalCount)} of{" "}
            {totalCount} courses
          </span>
          <div className="reviewer-courses-dashboard__pagination-controls">
            <button
              type="button"
              disabled={skip === 0}
              className="reviewer-courses-dashboard__btn reviewer-courses-dashboard__btn--preview"
              onClick={handlePrevPage}
            >
              <Icon name="chevron_left" size={16} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={skip + PAGE_SIZE >= totalCount}
              className="reviewer-courses-dashboard__btn reviewer-courses-dashboard__btn--preview"
              onClick={handleNextPage}
            >
              <span>Next</span>
              <Icon name="chevron_right" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
