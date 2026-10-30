import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import {
  GET_LESSON_BY_ID,
  GET_SECTION_BY_LESSON,
  GET_COURSE_BY_ID,
} from "@/graphql/course";
import { useAuthStore } from "@/store";

export interface LessonItem {
  id: string;
  lessonName: string;
  abstract?: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionResponse {
  id: string;
  urlPdf: string;
  content?: string | null;
  lecturer_segment?: string[] | null;
  order: number;
  lessonId?: string;
  createdAt?: string;
}

export type SectionItem = SectionResponse;

export interface CourseItem {
  id: string;
  courseName: string;
  abstract?: string | null;
  keyLearnings?: string[];
  status?: string | null;
}

type LessonResponse = {
  getLessonById: { isSuccess: boolean; lessons: LessonItem[] };
};

type SectionsResponse = {
  getSectionByLesson: SectionResponse[];
};

type CourseResponse = {
  getCourseById: CourseItem | null;
};

export interface TLessonData {
  lesson: LessonItem | null;
  sections: SectionResponse[];
  course: CourseItem | null;
}

export function useLesson(lessonId: string, initialData?: TLessonData) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["lesson", lessonId, isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return { lesson: null, sections: [], course: null };
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
          const courseRes = await graphqlClient.request<CourseResponse>(
            GET_COURSE_BY_ID,
            { id: lesson.courseId }
          );
          course = courseRes?.getCourseById ?? null;
        }
        const rawSections = sectionsRes?.getSectionByLesson ?? [];
        const sections = [...rawSections].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        return { lesson, sections, course };
      } catch {
        return { lesson: null, sections: [], course: null };
      }
    },
    initialData: initialData?.lesson ? initialData : undefined,
    enabled: !!lessonId,
  });
}
