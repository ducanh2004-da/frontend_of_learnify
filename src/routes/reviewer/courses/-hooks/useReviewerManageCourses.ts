import {
  useGetAllCourses,
  useGetCoursesById,
  usePublishCourse,
  useRejectCourse,
} from "@/hooks/useCourses";
import type { TBackendCourse } from "@/hooks/useCourses";
import type {
  MockCourseDetail,
  MockLesson,
  TReviewStatus,
} from "@/mock/reviewer-courses";
import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

type TLessonData = {
  id: string;
  lessonName: string;
  abstract: string;
  createdAt: string;
};

type TCourseDetailResponse = {
  getCourseById: TBackendCourse;
  getLessonsByCourseId: {
    isSuccess: boolean;
    count: number;
    lessons: TLessonData[];
    message: string;
  };
};

type TCourseStatus = "Pending" | "Published" | "Rejected" | "All";

function mapToMockCourse(
  courseDetail: TBackendCourse,
  lessons: MockLesson[]
): MockCourseDetail {
  return {
    id: courseDetail.id,
    title: courseDetail.courseName,
    abstract: courseDetail.abstract || "No description available.",
    keyLearnings: courseDetail.keyLearnings || [],
    status: courseDetail.status as TReviewStatus,
    instructorName: "Unknown Instructor",
    creatorName: "Unknown Creator",
    dateSubmitted: courseDetail.createdAt
      ? new Date(courseDetail.createdAt).toLocaleDateString()
      : "Unknown Date",
    thumbnail: "https://placehold.co/40x40/4f46e5/ffffff?text=RC",
    lessons,
  };
}

export function useReviewerManageCourses(opts: {
  selectedCourseId: string | undefined;
  statusFilter: TCourseStatus;
}) {
  const navigate = useNavigate();
  const { selectedCourseId, statusFilter } = opts;

  const { data: allCourses, isLoading } = useGetAllCourses();
  const courses = allCourses?.courses;

  const query = useGetCoursesById(selectedCourseId ?? "", {
    enabled: !!selectedCourseId,
  });
  const courseData = query.data as TCourseDetailResponse | undefined;
  const isFetching = query.isFetching;
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: rejectCourse, isPending: isRejecting } = useRejectCourse();

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (statusFilter === "All") return courses;
    return courses.filter((c) => c.status === statusFilter);
  }, [courses, statusFilter]);

  const courseDetail = courseData?.getCourseById;
  const lessonsData: MockLesson[] = (
    courseData?.getLessonsByCourseId?.lessons || []
  ).map((lesson: TLessonData, index: number) => ({
    id: lesson.id,
    lessonName: lesson.lessonName,
    abstract: lesson.abstract || "No abstract available.",
    order: index + 1,
  }));

  const selectedCourse: MockCourseDetail | null = useMemo(() => {
    if (!courseDetail) return null;
    return mapToMockCourse(courseDetail, lessonsData);
  }, [courseDetail, lessonsData]);

  const isCourseLoading = !!selectedCourseId && isFetching;

  const handleSelectCourse = (id: string) => {
    navigate({ to: ".", search: { courseId: id, tab: statusFilter } });
  };

  const handleTabChange = (tab: string) => {
    navigate({
      to: ".",
      search: { courseId: undefined, tab: tab as TCourseStatus },
    });
  };

  const handleApprove = () => {
    if (!selectedCourseId) return;
    publishCourse(selectedCourseId);
  };

  const handleReject = () => {
    if (!selectedCourseId) return;
    rejectCourse(selectedCourseId);
  };

  return {
    courses: filteredCourses,
    selectedCourse,
    selectedCourseId,
    statusFilter,
    isLoading,
    isCourseLoading,
    isPublishing,
    isRejecting,
    handleSelectCourse,
    handleTabChange,
    handleApprove,
    handleReject,
  };
}
