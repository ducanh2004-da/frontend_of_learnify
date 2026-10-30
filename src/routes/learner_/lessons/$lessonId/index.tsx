import "./lessonId.scss";

import CubeLoader from "@/components/CubeLoader";
import NotFound from "@/components/NotFound";
import { createFileRoute } from "@tanstack/react-router";
import LessonError from "../-components/LessonError";
import { graphqlClient } from "@/lib/graphql";
import {
  GET_COURSE_BY_ID,
  GET_LESSON_BY_ID,
  GET_SECTION_BY_LESSON,
} from "@/graphql/course";
import type {
  CourseItem,
  LessonItem,
  SectionResponse,
} from "@/hooks/useLesson";
import { seo } from "@/utils/seo";

type LessonResponse = {
  getLessonById: { isSuccess: boolean; lessons: LessonItem[] };
};

type SectionsResponse = {
  getSectionByLesson: SectionResponse[];
};

type CourseResponse = {
  getCourseById: CourseItem | null;
};

export interface LessonLoaderData {
  lesson: LessonItem | null;
  sections: SectionResponse[];
  course: CourseItem | null;
  lessonName: string;
  courseName: string;
  description: string;
}

export const Route = createFileRoute("/learner_/lessons/$lessonId/")({
  loader: async ({ params: { lessonId } }): Promise<LessonLoaderData> => {
    try {
      const [lessonRes, sectionsRes] = await Promise.all([
        graphqlClient.request<LessonResponse>(GET_LESSON_BY_ID, {
          id: lessonId,
        }),
        graphqlClient.request<SectionsResponse>(GET_SECTION_BY_LESSON, {
          lessonId,
        }),
      ]);

      const lesson = lessonRes?.getLessonById?.lessons?.[0] ?? null;
      let course: CourseItem | null = null;
      if (lesson?.courseId) {
        try {
          const courseRes = await graphqlClient.request<CourseResponse>(
            GET_COURSE_BY_ID,
            { id: lesson.courseId }
          );
          course = courseRes?.getCourseById ?? null;
        } catch {
          // Ignore error fetching course metadata
        }
      }

      const rawSections = sectionsRes?.getSectionByLesson ?? [];
      const sections = [...rawSections].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );

      const lessonName = lesson?.lessonName || "Lesson";
      const courseName = course?.courseName || "Course";
      const firstSectionContent = sections.find((s) => s.content)?.content;
      const description =
        lesson?.abstract?.trim() ||
        firstSectionContent?.slice(0, 160)?.trim() ||
        `Study ${lessonName} from course ${courseName} on Learnify.`;

      return {
        lesson,
        sections,
        course,
        lessonName,
        courseName,
        description,
      };
    } catch {
      return {
        lesson: null,
        sections: [],
        course: null,
        lessonName: "Lesson",
        courseName: "Course",
        description: "Learnify Lesson",
      };
    }
  },
  head: ({ loaderData }) => {
    const lessonName = loaderData?.lessonName || "Lesson";
    const courseName = loaderData?.courseName || "Course";
    const title = `${lessonName} | ${courseName} - Learnify`;
    const description =
      loaderData?.description ||
      `Study ${lessonName} from course ${courseName} on Learnify.`;

    return {
      meta: [
        ...seo({
          title,
          description,
        }),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  errorComponent: LessonError,
  pendingComponent: CubeLoader,
  notFoundComponent: NotFound,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
