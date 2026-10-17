import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import {
  useGetCoursesById,
  useGetLessonsByCourseId,
  usePublishCourse,
  useRejectCourse,
} from "@/hooks/useCourses";
import { useLesson } from "@/hooks/useLesson";
import TetrisLoader from "@/components/TetrisLoader";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import "./preview.scss";

const previewSearchSchema = z.object({
  lessonId: z.string().optional(),
});

export const Route = createFileRoute("/reviewer/courses/$courseId/")({
  validateSearch: previewSearchSchema,
  head: () => ({
    meta: [{ title: "Course Content Preview | Content Reviewer | Learnify" }],
  }),
  component: CoursePreviewPage,
});

function CoursePreviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/reviewer/courses/$courseId/" });
  const { courseId } = Route.useParams();
  const search = Route.useSearch();
  const { lessonId } = search;

  // Course query
  const { data: courseData, isLoading: isCourseLoading } =
    useGetCoursesById(courseId);
  const course = courseData?.getCourseById?.course;

  // Lessons query
  const { data: lessons = [], isLoading: isLessonsLoading } =
    useGetLessonsByCourseId(courseId);

  // Active lesson selection
  const activeLessonId = lessonId || lessons[0]?.id || "";
  const selectedLesson =
    lessons.find((l) => l.id === activeLessonId) || lessons[0] || null;

  // Active lesson sections & content
  const { data: lessonData, isLoading: isLessonLoading } =
    useLesson(activeLessonId);
  const sections = lessonData?.sections ?? [];

  // Mutations
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: rejectCourse, isPending: isRejecting } = useRejectCourse();

  const handleSelectLesson = (id: string) => {
    navigate({
      search: { lessonId: id },
    });
  };

  const statusKey = (course?.status || "Pending").toLowerCase();

  return (
    <div className="reviewer-course-preview">
      {/* Sticky Action Header */}
      <header className="reviewer-course-preview__sticky-bar">
        <div className="reviewer-course-preview__sticky-bar-left">
          <Link
            to="/reviewer/courses"
            search={{ tab: "All", skip: 0 }}
            className="reviewer-course-preview__sticky-bar-back"
          >
            <Icon name="arrow_back" size={16} />
            <span>{t("common.back_to_courses", "Back to Courses")}</span>
          </Link>

          <div className="reviewer-course-preview__sticky-bar-title-info">
            <h1 className="reviewer-course-preview__sticky-bar-title">
              {course?.courseName ||
                (isCourseLoading ? "Loading..." : "Course Preview")}
            </h1>
            {course?.status && (
              <span
                className={`reviewer-course-preview__sticky-bar-badge reviewer-course-preview__sticky-bar-badge--${statusKey}`}
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
            )}
          </div>
        </div>

        <div className="reviewer-course-preview__sticky-bar-actions">
          <button
            type="button"
            disabled={isPublishing || course?.status === "Published"}
            className="reviewer-course-preview__btn reviewer-course-preview__btn--publish"
            onClick={() => publishCourse(courseId)}
          >
            <Icon name="check_circle" size={16} />
            <span>
              {isPublishing
                ? "Publishing..."
                : course?.status === "Published"
                  ? "Published"
                  : "Publish Course"}
            </span>
          </button>

          <button
            type="button"
            disabled={isRejecting || course?.status === "Rejected"}
            className="reviewer-course-preview__btn reviewer-course-preview__btn--reject"
            onClick={() => rejectCourse(courseId)}
          >
            <Icon name="cancel" size={16} />
            <span>
              {isRejecting
                ? "Rejecting..."
                : course?.status === "Rejected"
                  ? "Rejected"
                  : "Reject Course"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="reviewer-course-preview__body">
        {/* Left Column: Lessons Sidebar */}
        <aside className="reviewer-course-preview__sidebar">
          <div className="reviewer-course-preview__sidebar-header">
            <h2 className="reviewer-course-preview__sidebar-header-title">
              {t("courses.curriculum", "Curriculum")}
            </h2>
            <span className="reviewer-course-preview__sidebar-header-count">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>

          {isLessonsLoading ? (
            <div className="reviewer-course-preview__content-loader">
              <TetrisLoader />
            </div>
          ) : lessons.length === 0 ? (
            <div className="reviewer-course-preview__content-empty">
              <p>{t("courses.no_lessons", "No lessons in this course yet.")}</p>
            </div>
          ) : (
            <ol className="reviewer-course-preview__sidebar-list">
              {lessons.map((lesson, idx) => {
                const isActive = lesson.id === activeLessonId;
                const orderNum = String(idx + 1).padStart(2, "0");

                return (
                  <li
                    key={lesson.id}
                    className={`reviewer-course-preview__sidebar-item ${
                      isActive
                        ? "reviewer-course-preview__sidebar-item--active"
                        : ""
                    }`}
                    onClick={() => handleSelectLesson(lesson.id)}
                  >
                    <span className="reviewer-course-preview__sidebar-item-order">
                      {orderNum}
                    </span>
                    <div className="reviewer-course-preview__sidebar-item-info">
                      <span className="reviewer-course-preview__sidebar-item-name">
                        {lesson.lessonName}
                      </span>
                      {lesson.abstract && (
                        <span className="reviewer-course-preview__sidebar-item-abstract">
                          {lesson.abstract}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </aside>

        {/* Right Column: Lesson Content & Section Markdown Preview */}
        <main className="reviewer-course-preview__content">
          {isCourseLoading || isLessonsLoading ? (
            <div className="reviewer-course-preview__content-loader">
              <TetrisLoader />
            </div>
          ) : lessons.length === 0 ? (
            <Empty>
              <Empty.Header>
                <Empty.Media variant="icon">
                  <Icon name="menu_book" size={40} />
                </Empty.Media>
                <Empty.Title>No Lessons to Preview</Empty.Title>
                <Empty.Description>
                  This course does not have any generated lessons or sections
                  yet.
                </Empty.Description>
              </Empty.Header>
            </Empty>
          ) : isLessonLoading ? (
            <div className="reviewer-course-preview__content-loader">
              <TetrisLoader />
            </div>
          ) : (
            <article>
              <header style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    margin: "0 0 0.5rem 0",
                    color: "var(--color-neutral-900, #111)",
                  }}
                >
                  {selectedLesson?.lessonName}
                </h2>
                {selectedLesson?.abstract && (
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      color: "var(--color-neutral-600, #555)",
                      margin: 0,
                    }}
                  >
                    {selectedLesson.abstract}
                  </p>
                )}
              </header>

              {sections.length === 0 ? (
                <Empty>
                  <Empty.Header>
                    <Empty.Media variant="icon">
                      <Icon name="description" size={36} />
                    </Empty.Media>
                    <Empty.Title>No Sections Generated</Empty.Title>
                    <Empty.Description>
                      This lesson does not contain any sections yet.
                    </Empty.Description>
                  </Empty.Header>
                </Empty>
              ) : (
                <div className="reviewer-course-preview__section-list">
                  {sections.map((section, idx) => {
                    const sectionNum =
                      section.order != null ? section.order + 1 : idx + 1;

                    return (
                      <section
                        key={section.id || `section-${idx}`}
                        className="reviewer-course-preview__section"
                      >
                        <div className="reviewer-course-preview__section-header">
                          <span className="reviewer-course-preview__section-badge">
                            Section {sectionNum}
                          </span>
                        </div>

                        {section.urlPdf && (
                          <div className="reviewer-course-preview__section-image-box">
                            <img
                              src={section.urlPdf}
                              alt={`Visual diagram for section ${sectionNum}`}
                              loading="lazy"
                            />
                          </div>
                        )}

                        {section.content && (
                          <div className="reviewer-course-preview__section-markdown">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
