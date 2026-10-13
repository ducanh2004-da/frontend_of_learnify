import {
  useQuery,
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import {
  GET_ALL_PUBLISHED_COURSES_QUERY,
  GET_COURSE_LESSONS_BY_ID_QUERY,
  GET_COURSE_BY_STATUS_QUERY,
  GET_COURSE_BY_USER_ID_QUERY,
  GET_INSTRUCTOR_DASHBOARD,
  PUBLISH_COURSE_MUTATION,
  REJECT_COURSE_MUTATION,
  CREATE_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
  GET_ALL_COURSES_QUERY,
} from "@/graphql/course";
import {
  CREATE_LESSON_FROM_AI_MUTATION,
  DELETE_LESSON_MUTATION,
  UPLOAD_DOCUMENT_MUTATION,
} from "@/graphql/mutations";
import i18n from "@/i18n";
import { toast } from "sonner";

export type TBackendCourse = {
  id: string;
  courseName: string;
  abstract: string;
  createdAt: string;
  keyLearnings: string[];
  status: string;
  updatedAt: string;
};

type GetCourseByIdResponse = {
  getCourseById: {
    isSuccess: boolean;
    message: string;
    course: TBackendCourse;
  };
};

type GetAllPublishedCoursesResponse = {
  getAllPublishedCourses: {
    count: number;
    courses: TBackendCourse[];
    isSuccess: boolean;
    message: string;
  };
};

type GetCoursesByStatusResponse = {
  getCoursesByStatus: {
    count: number;
    courses: TBackendCourse[];
    isSuccess: boolean;
    message: string;
  };
};

export function useGetAllCourses(skip: number = 0) {
  return useQuery({
    queryKey: ["courses", "all", skip],
    queryFn: async () => {
      const response =
        await graphqlClient.request<GetAllPublishedCoursesResponse>(
          GET_ALL_COURSES_QUERY,
          { skip }
        );
      return response.getAllPublishedCourses;
    },
  });
}
export function useGetAllPublishedCourses(skip: number = 0) {
  return useQuery({
    queryKey: ["courses", "all", skip],
    queryFn: async () => {
      const response =
        await graphqlClient.request<GetAllPublishedCoursesResponse>(
          GET_ALL_PUBLISHED_COURSES_QUERY,
          { skip }
        );
      return response.getAllPublishedCourses;
    },
  });
}

export function useSuspenseGetAllCourses(skip: number = 0) {
  return useSuspenseQuery({
    queryKey: ["courses", "all", skip],
    queryFn: async () => {
      const response =
        await graphqlClient.request<GetAllPublishedCoursesResponse>(
          GET_ALL_PUBLISHED_COURSES_QUERY,
          { skip }
        );
      return response.getAllPublishedCourses;
    },
  });
}

export function useGetCoursesStatus(status: string, skip: number = 0) {
  return useQuery({
    queryKey: ["courses", "status", status, skip],
    queryFn: async () => {
      const response = await graphqlClient.request<GetCoursesByStatusResponse>(
        GET_COURSE_BY_STATUS_QUERY,
        { status, skip }
      );
      return response.getCoursesByStatus;
    },
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      return await graphqlClient.request(PUBLISH_COURSE_MUTATION, { courseId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses", "all"],
      });
      toast.success(i18n.t("courses.toast.course_published"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.publish_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useRejectCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      return await graphqlClient.request(REJECT_COURSE_MUTATION, { courseId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses", "all"],
      });
      toast.success(i18n.t("courses.toast.course_rejected"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.reject_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useGetCoursesById(
  courseId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["courses", "id", courseId],
    queryFn: async () => {
      const response = await graphqlClient.request<any>(
        GET_COURSE_LESSONS_BY_ID_QUERY,
        { getCourseByIdId: courseId }
      );
      return response;
    },
    staleTime: 0,
    enabled: options?.enabled ?? true,
  });
}

export function useGetCoursesByUserId(userId: string) {
  return useQuery({
    queryKey: ["courses", "user", userId],
    queryFn: async () => {
      const res = await graphqlClient.request<{
        getCourseByUserId: TBackendCourse[];
      }>(GET_COURSE_BY_USER_ID_QUERY, { userId });
      return res.getCourseByUserId;
    },
    enabled: !!userId,
  });
}

type TInstructorDashboardData = {
  courses: TBackendCourse[];
  totalCourses: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalLessons: number;
  recentCourses: TBackendCourse[];
};

export function useInstructorDashboard(userId: string) {
  return useQuery({
    queryKey: ["instructor", "dashboard", userId],
    queryFn: async () => {
      const res = await graphqlClient.request<{
        getCourseByUserId: TBackendCourse[];
        getAllLessons: {
          count: number;
          lessons: { id: string; courseId: string }[];
        };
      }>(GET_INSTRUCTOR_DASHBOARD, { userId });
      const courses = res.getCourseByUserId;
      const allLessons = res.getAllLessons.lessons;
      const courseIds = new Set(courses.map((c) => c.id));
      const totalLessons = allLessons.filter((l) =>
        courseIds.has(l.courseId)
      ).length;
      return {
        courses,
        totalCourses: courses.length,
        publishedCount: courses.filter((c) => c.status === "Published").length,
        pendingCount: courses.filter((c) => c.status === "Pending").length,
        rejectedCount: courses.filter((c) => c.status === "Rejected").length,
        totalLessons,
        recentCourses: [...courses]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5),
      } satisfies TInstructorDashboardData;
    },
    enabled: !!userId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      courseName: string;
      abstract?: string;
      creatorId?: string;
      isFree: boolean;
      originalPrice: number;
    }) => {
      return await graphqlClient.request(CREATE_COURSE_MUTATION, { data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(i18n.t("courses.toast.course_created"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.create_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await graphqlClient.request(DELETE_COURSE_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(i18n.t("courses.toast.course_deleted"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.delete_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useCreateLessonFromAi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      data: { course_id: string; lessonName: string; abstract: string };
      pdfFile: File;
    }) => {
      return await graphqlClient.request(
        CREATE_LESSON_FROM_AI_MUTATION,
        variables
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(i18n.t("courses.toast.lesson_created"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.lesson_create_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await graphqlClient.request(DELETE_LESSON_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(i18n.t("courses.toast.lesson_deleted"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.lesson_delete_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: async (variables: { file: File; uploadedBy?: string }) => {
      return await graphqlClient.request(UPLOAD_DOCUMENT_MUTATION, variables);
    },
    onSuccess: () => {
      toast.success(i18n.t("courses.toast.file_uploaded"));
    },
    onError: (error) => {
      toast.error(
        i18n.t("courses.toast.file_upload_failed", {
          message: (error as Error).message,
        })
      );
    },
  });
}
