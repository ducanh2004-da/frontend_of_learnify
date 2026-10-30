import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import {
  GET_COURSE_BY_ID,
  GET_LESSON_BY_ID,
  GET_LESSONS_BY_COURSE_ID_QUERY,
} from "@/graphql/course";
import { graphqlClient } from "@/lib/graphql";
import { COLORS } from "@/styles/colors";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
import type { TCourseControllerProps } from "./type";

type LessonMeta = { id: string; lessonName: string; courseId: string };
type LessonList = { id: string; lessonName: string }[];

const CourseController = ({ className }: TCourseControllerProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const lessonId = useRouterState({
    select: (s) => {
      const m = s.matches.find(
        (m) => m.routeId === "/learner_/lessons/$lessonId/"
      );
      return (m?.params as { lessonId?: string })?.lessonId;
    },
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1280px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setIsExpanded(false);
    };
    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { data: lessonData, isLoading: loadingLesson } = useQuery({
    queryKey: ["lesson-meta", lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      const res = await graphqlClient.request<{
        getLessonById: { lessons: LessonMeta[] };
      }>(GET_LESSON_BY_ID, { id: lessonId });
      return res.getLessonById.lessons[0] || null;
    },
    enabled: !!lessonId,
  });

  const courseId = lessonData?.courseId;

  const { data: courseData } = useQuery({
    queryKey: ["course-meta", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const res = await graphqlClient.request<{
        getCourseById: { courseName: string } | null;
      }>(GET_COURSE_BY_ID, { id: courseId });
      return res.getCourseById;
    },
    enabled: !!courseId,
  });

  const { data: courseLessons, isLoading: loadingLessons } = useQuery({
    queryKey: ["course-lessons-list", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const res = await graphqlClient.request<{
        getLessonsByCourseId: { lessons: LessonList };
      }>(GET_LESSONS_BY_COURSE_ID_QUERY, { id: courseId });
      return res.getLessonsByCourseId.lessons;
    },
    enabled: !!courseId,
  });

  const courseName =
    courseData?.courseName ||
    lessonData?.lessonName ||
    t("course_controller.course_fallback");
  const loading =
    isExpanded && (loadingLesson || (!!courseId && loadingLessons));

  return (
    <nav
      className={classnames(
        "course-controller",
        { expanded: isExpanded },
        className
      )}
      data-lenis-prevent
    >
      {isExpanded ? (
        <div className="course-controller_expanded">
          <div className="course-controller_header">
            <h5 className="course-controller_title bold" title={courseName}>
              {courseName}
            </h5>
            <IconButton
              icon="close"
              onClick={() => setIsExpanded(false)}
              size="tiny"
              shape="circle"
              type="custom"
              color={COLORS.neutral900}
              tooltip={t("course_controller.close")}
            />
          </div>
          <div className="course-controller_lessons">
            {loading ? (
              <div className="course-controller_loading">
                {t("course_controller.loading_lessons")}
              </div>
            ) : (
              courseLessons?.map((lesson) => {
                const isActive = lesson.id === lessonId;
                return (
                  <button
                    key={lesson.id}
                    className={classnames("course-controller_lesson", {
                      active: isActive,
                    })}
                    onClick={() => {
                      window.location.href = `/learner/lessons/${lesson.id}`;
                    }}
                  >
                    <Icon
                      name={isActive ? "play_circle" : "radio_button_unchecked"}
                      className="course-controller_lesson-icon"
                    />
                    <span
                      className="course-controller_lesson-name"
                      title={lesson.lessonName}
                    >
                      {lesson.lessonName}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="course-controller_compact">
          <IconButton
            icon="menu"
            onClick={() => setIsExpanded(true)}
            size="tiny"
            shape="circle"
            type="custom"
            color={COLORS.neutral900}
            tooltip={t("course_controller.open_menu")}
          />
        </div>
      )}
    </nav>
  );
};

export default CourseController;
