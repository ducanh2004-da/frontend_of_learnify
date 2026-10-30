import "./courses.scss";

import Card from "@/components/Card";
import ErrorScene from "@/components/ErrorScene";
import Search from "@/components/Search";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import {
  useSuspenseGetAllCourses,
  type TBackendCourse,
} from "@/hooks/useCourses";
import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Suspense, useState, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import CourseFilter, { type TCourseFilters } from "./-components/CourseFilter";
import { Route as parentRoute } from "./index";

function CoursesErrorComponent() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("errors.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("errors.load_courses")}
        </ErrorScene.Description>
      </ErrorScene.Header>
      <ErrorScene.Content>
        <div className="error-scene__control">
          <TextButton
            text={t("errors.try_again")}
            onClick={() => router.invalidate()}
            className="error-scene__btn"
            size="medium"
            icon="refresh"
          />
          <TextButton
            text={t("errors.go_back")}
            onClick={() => window.history.back()}
            className="error-scene__btn error-scene__btn--secondary"
            size="medium"
            icon="arrow_back"
            type="outlined"
          />
        </div>
      </ErrorScene.Content>
    </ErrorScene>
  );
}

export const Route = createLazyFileRoute("/learner/courses/")({
  errorComponent: CoursesErrorComponent,
  component: CoursesPage,
});

const DURATION_RANGES: Record<string, { min: number; max: number }> = {
  "30": { min: 0, max: 30 },
  "45": { min: 31, max: 45 },
  "60": { min: 46, max: 60 },
  "120": { min: 61, max: 120 },
  "180": { min: 121, max: Infinity },
};

function CoursesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { q, courseType, duration } = parentRoute.useSearch();
  const { data } = useSuspenseGetAllCourses(0);
  const isBackendSuccess = data?.isSuccess && data.courses.length > 0;
  const [filterOpen, setFilterOpen] = useState(false);

  const allCourses = useMemo(
    () =>
      isBackendSuccess
        ? data.courses.map((course: TBackendCourse) => ({
            id: course.id,
            typeSpecial: "course" as const,
            title: course.courseName,
            description: course.abstract,
            duration: 45,
            status: "default" as const,
            percentage: 0,
            badgeStatus: (course.status === "Published"
              ? "public"
              : "private") as "public" | "private",
            isFree: (course as TBackendCourse & { isFree?: boolean }).isFree,
          }))
        : [],
    [data, isBackendSuccess]
  );

  const filters: TCourseFilters = useMemo(
    () => ({
      courseType: courseType ?? undefined,
      durationRange: duration ?? undefined,
    }),
    [courseType, duration]
  );

  const filteredCourses = useMemo(() => {
    let result = allCourses;

    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    if (filters.courseType === "free") {
      result = result.filter((c) => c.isFree === true);
    } else if (filters.courseType === "paid") {
      result = result.filter((c) => c.isFree !== true);
    }

    if (filters.durationRange) {
      const range = DURATION_RANGES[filters.durationRange];
      if (range) {
        result = result.filter(
          (c) => c.duration >= range.min && c.duration <= range.max
        );
      }
    }

    return result;
  }, [allCourses, q, filters]);

  const handleFilterChange = (newFilters: TCourseFilters) => {
    navigate({
      to: "/learner/courses",
      search: {
        q,
        courseType: newFilters.courseType,
        duration: newFilters.durationRange,
      },
    });
  };

  const clearFilters = () => {
    navigate({ to: "/learner/courses", search: { q } });
  };

  const hasActiveFilters = !!filters.courseType || !!filters.durationRange;

  return (
    <div className="courses-container">
      <Suspense fallback={<TetrisLoader />}>
        <div className="courses-container__title">
          <h2 className="courses-container__title-context medium">
            <Trans
              key={i18n.language}
              i18nKey="courses.title"
              components={{ Beauty: <span className="beauty" /> }}
            />
          </h2>
          <p className="courses-container__title-description regular">
            {t("courses.description")}
          </p>
        </div>
        <div className="courses-content">
          <Search
            onSearch={(query) =>
              navigate({
                to: "/learner/courses",
                search: {
                  q: query,
                  courseType: filters.courseType,
                  duration: filters.durationRange,
                },
              })
            }
          />
          <div className="controls">
            <div className="controls__left">
              <TextButton
                text={t("courses.filter_btn")}
                icon="filter_list"
                roundedCorner="roundedSquare"
                size="tiny"
                type={hasActiveFilters ? "primary" : "outlined"}
                onClick={() => setFilterOpen(!filterOpen)}
              />
              <CourseFilter
                isOpen={filterOpen}
                filters={filters}
                onToggle={() => setFilterOpen(!filterOpen)}
                onFilterChange={handleFilterChange}
                onClose={() => setFilterOpen(false)}
              />
              {hasActiveFilters && (
                <TextButton
                  text={t("courses.filter_clear")}
                  size="tiny"
                  type="outlined"
                  icon="close"
                  onClick={clearFilters}
                />
              )}
            </div>
            <p className="result">
              {hasActiveFilters || q
                ? t("courses.results_filtered", {
                    filtered: filteredCourses.length,
                    total: allCourses.length,
                  })
                : t("courses.results", { count: filteredCourses.length })}
            </p>
          </div>
          {filteredCourses.length > 0 ? (
            <div className="courses-list">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
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
              ))}
            </div>
          ) : (
            <div className="courses-empty">
              <p>{t("search.no_results")}</p>
              <p className="courses-empty__desc">
                {t("search.no_results_desc")}
              </p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
