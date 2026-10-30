import Card from "@/components/Card";
import Empty from "@/components/Empty";
import ErrorScene from "@/components/ErrorScene";
import Icon from "@/components/Icon";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { useGetAllCourses, type TBackendCourse } from "@/hooks/useCourses";
import { useAllRoadmaps, type TBackendRoadmapItem } from "@/hooks/useRoadmap";
import { graphqlClient } from "@/lib/graphql";
import { GET_ALL_LESSONS_QUERY } from "@/graphql/course";
import { useQuery } from "@tanstack/react-query";
import { createLearnerHead } from "@/utils";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import "./style.scss";

const searchSchema = z.object({
  q: z.string().catch(""),
});

function SearchErrorComponent() {
  const router = useRouter();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>Server Error</ErrorScene.Title>
        <ErrorScene.Description>
          Something went wrong while searching. Please try again.
        </ErrorScene.Description>
      </ErrorScene.Header>
      <ErrorScene.Content>
        <div className="error-scene__control">
          <TextButton
            text="Try Again"
            onClick={() => router.invalidate()}
            className="error-scene__btn"
            size="medium"
            icon="refresh"
          />
          <TextButton
            text="Go Back"
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

type TLessonSearchItem = {
  id: string;
  lessonName: string;
  abstract: string;
  courseId: string;
};

type TLessonResponse = {
  getAllLessons: {
    isSuccess: boolean;
    count: number;
    lessons: TLessonSearchItem[];
  };
};

export const Route = createFileRoute("/learner/search/")({
  validateSearch: searchSchema,
  errorComponent: SearchErrorComponent,
  head: () => createLearnerHead("Search"),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useTranslation();
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  const { data: courseData, isLoading: coursesLoading } = useGetAllCourses(0);
  const { data: roadmapData, isLoading: roadmapsLoading } = useAllRoadmaps();
  const { data: lessonData, isLoading: lessonsLoading } =
    useQuery<TLessonResponse>({
      queryKey: ["all-lessons"],
      queryFn: async () =>
        graphqlClient.request<TLessonResponse>(GET_ALL_LESSONS_QUERY),
    });

  const query = q.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    if (!courseData?.isSuccess || !query) return [];
    return courseData.courses.filter(
      (course: TBackendCourse) =>
        course.courseName.toLowerCase().includes(query) ||
        course.abstract?.toLowerCase().includes(query)
    );
  }, [courseData, query]);

  const filteredRoadmaps = useMemo(() => {
    if (!roadmapData?.isSuccess || !query) return [];
    return roadmapData.roadmap.filter(
      (item: TBackendRoadmapItem) =>
        item.roadMapName.toLowerCase().includes(query) ||
        item.abstract?.toLowerCase().includes(query)
    );
  }, [roadmapData, query]);

  const filteredLessons = useMemo(() => {
    if (!lessonData?.getAllLessons?.isSuccess || !query) return [];
    return lessonData.getAllLessons.lessons.filter(
      (lesson: TLessonSearchItem) =>
        lesson.lessonName.toLowerCase().includes(query) ||
        lesson.abstract?.toLowerCase().includes(query)
    );
  }, [lessonData, query]);

  const isLoading = coursesLoading || roadmapsLoading || lessonsLoading;
  const hasQuery = !!query;
  const hasResults =
    filteredCourses.length > 0 ||
    filteredRoadmaps.length > 0 ||
    filteredLessons.length > 0;

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h2 className="medium">
          {hasQuery
            ? t("search.results_for", { query })
            : t("search.placeholder")}
        </h2>
      </div>

      {isLoading ? (
        <TetrisLoader />
      ) : hasResults ? (
        <div className="search-page__results">
          {filteredCourses.length > 0 && (
            <section className="search-page__section">
              <div className="search-page__section-header">
                <h3 className="search-page__section-title">
                  {t("search.section_courses")}
                </h3>
                <span className="search-page__section-count">
                  {t("search.found_courses", { count: filteredCourses.length })}
                </span>
              </div>
              <div className="search-page__grid">
                {filteredCourses.map((course: TBackendCourse) => (
                  <Card
                    key={course.id}
                    typeSpecial="course"
                    title={course.courseName}
                    description={course.abstract}
                    duration={45}
                    status="default"
                    percentage={0}
                    onClick={() =>
                      navigate({
                        to: "/learner/courses/$courseId",
                        params: { courseId: course.id.toString() },
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {filteredRoadmaps.length > 0 && (
            <section className="search-page__section">
              <div className="search-page__section-header">
                <h3 className="search-page__section-title">
                  {t("search.section_roadmaps")}
                </h3>
                <span className="search-page__section-count">
                  {t("search.found_roadmaps", {
                    count: filteredRoadmaps.length,
                  })}
                </span>
              </div>
              <div className="search-page__grid">
                {filteredRoadmaps.map((item: TBackendRoadmapItem) => (
                  <Card
                    key={item.id}
                    typeSpecial="roadmap"
                    title={item.roadMapName}
                    description={item.abstract}
                    onClick={() =>
                      navigate({
                        to: "/learner/roadmaps/$roadmapId",
                        params: { roadmapId: item.id.toString() },
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {filteredLessons.length > 0 && (
            <section className="search-page__section">
              <div className="search-page__section-header">
                <h3 className="search-page__section-title">
                  {t("search.section_lessons")}
                </h3>
                <span className="search-page__section-count">
                  {t("search.found_lessons", {
                    count: filteredLessons.length,
                  })}
                </span>
              </div>
              <div className="search-page__grid">
                {filteredLessons.map((lesson: TLessonSearchItem) => (
                  <Card
                    key={lesson.id}
                    typeSpecial="lesson"
                    title={lesson.lessonName}
                    description={lesson.abstract}
                    onClick={() =>
                      navigate({
                        to: "/learner/lessons/$lessonId",
                        params: { lessonId: lesson.id.toString() },
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : hasQuery ? (
        <Empty>
          <Empty.Header>
            <Empty.Media variant="icon">
              <Icon name="close" />
            </Empty.Media>
            <Empty.Title>{t("search.no_results")}</Empty.Title>
            <Empty.Description>{t("search.no_results_desc")}</Empty.Description>
          </Empty.Header>
        </Empty>
      ) : null}
    </div>
  );
}
