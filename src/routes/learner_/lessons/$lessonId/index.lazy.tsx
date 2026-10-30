import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import TetrisLoader from "@/components/TetrisLoader";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ChatArea from "../-components/ChatArea";
import LessonContent from "../-components/LessonContent";
import CourseContext from "../-components/CourseContext";
import type { TCourseContextRef } from "../-components/CourseContext/type";
import useLessonDetail from "../-hooks/useLessonDetail";
import useTeacher from "../-hooks/useTeacher";
import { graphqlClient } from "@/lib/graphql";
import {
  FIND_ENROLLMENT_QUERY,
  GET_LESSONS_BY_COURSE_ID_QUERY,
} from "@/graphql/course";
import { useAuthStore } from "@/store";
import CourseCompletionModal from "../-components/CourseCompletionModal";

export const Route = createLazyFileRoute("/learner_/lessons/$lessonId/")({
  component: LessonDetail,
});

function LessonDetail() {
  const { lessonId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const {
    data,
    isLoading,
    state,
    sections,
    startLesson,
    skipToQA,
    skipToQuiz,
    completeLesson,
    reset,
    handleComplete,
    isCourseCompleted,
  } = useLessonDetail(lessonId, loaderData);
  const {
    chatRef,
    stopRef,
    isMuted,
    stopChat,
    setAnimation,
    setStatus,
    resetTeacher,
  } = useTeacher();
  const courseContextRef = useRef<TCourseContextRef>(null);
  const isInitialMount = useRef(true);

  const onLessonChange = useEffectEvent(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    chatRef.current?.resetAndClear?.();
    reset();
    resetTeacher();
    courseContextRef.current?.reset();
  });

  useEffect(() => {
    onLessonChange();
  }, [lessonId]);

  useEffect(() => {
    const ref = stopRef;
    return () => {
      ref.current?.();
    };
  }, [stopRef]);

  const handleSkipLesson = useCallback(() => {
    stopChat();
    skipToQA();
  }, [stopChat, skipToQA]);
  const handleSkipQA = useCallback(() => {
    stopChat();
    skipToQuiz();
  }, [stopChat, skipToQuiz]);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const handleSkipQuiz = useCallback(() => {
    stopChat();
    completeLesson();
    handleComplete();
    if (isCourseCompleted) {
      setTimeout(() => setShowCourseModal(true), 500);
    }
  }, [stopChat, completeLesson, handleComplete, isCourseCompleted]);
  const handleLessonComplete = useCallback(() => {
    skipToQA();
  }, [skipToQA]);

  const courseId = data?.lesson?.courseId;
  const userId = useAuthStore((s) => s.user?.id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: enrollmentData, isLoading: isCheckingEnrollment } = useQuery({
    queryKey: ["enrollment", courseId, userId],
    queryFn: async () => {
      if (!courseId || !userId) return null;
      return graphqlClient.request<{
        findEnrollment: { id: string } | null;
      }>(FIND_ENROLLMENT_QUERY, { courseId });
    },
    enabled: !!courseId && !!userId && !!data?.lesson,
  });

  const { data: courseLessons } = useQuery({
    queryKey: ["course-lessons-list", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const res = await graphqlClient.request<{
        getLessonsByCourseId: { lessons: { id: string; lessonName: string }[] };
      }>(GET_LESSONS_BY_COURSE_ID_QUERY, { id: courseId });
      return res.getLessonsByCourseId.lessons;
    },
    enabled: !!courseId,
  });

  const currentLessonIndex = useMemo(() => {
    if (!courseLessons) return -1;
    return courseLessons.findIndex((l) => l.id === lessonId);
  }, [courseLessons, lessonId]);

  const nextLesson = useMemo(() => {
    if (
      currentLessonIndex < 0 ||
      currentLessonIndex >= (courseLessons?.length ?? 0) - 1
    )
      return null;
    return courseLessons![currentLessonIndex + 1];
  }, [currentLessonIndex, courseLessons]);

  useEffect(() => {
    if (isCheckingEnrollment || !courseId) return;
    if (!enrollmentData?.findEnrollment) {
      toast.error(t("toast_enroll_first"));
      navigate({ to: "/learner/courses/$courseId", params: { courseId } });
    }
  }, [enrollmentData, isCheckingEnrollment, courseId, navigate, t]);

  const hasCourseId = !!courseId;
  const enrollmentChecked = !hasCourseId || !!enrollmentData;
  const isNotEnrolled =
    enrollmentChecked && hasCourseId && !enrollmentData?.findEnrollment;

  if (isLoading || isCheckingEnrollment || isNotEnrolled) {
    return (
      <div className="lesson-detail-page lesson-detail-page_loading">
        <TetrisLoader />
      </div>
    );
  }

  const showChatArea = state !== "initial" && state !== "complete";

  return (
    <div className="lesson-detail-page">
      <LessonContent
        lessonName={data?.lesson?.lessonName}
        abstract={data?.lesson?.abstract}
        sections={data?.sections || []}
        isLoading={isLoading}
      />

      <div className="lesson-sidebar-column">
        <ChatArea
          state={state}
          lessonName={data?.lesson?.lessonName}
          abstract={data?.lesson?.abstract}
          sectionCount={data?.sections?.length}
          sections={data?.sections || []}
          chatRef={chatRef}
          stopRef={stopRef}
          lessonId={lessonId}
          isMuted={isMuted}
          startLesson={startLesson}
          onSkipLesson={handleSkipLesson}
          onSkipQA={handleSkipQA}
          onSkipQuiz={handleSkipQuiz}
          handleLessonComplete={handleLessonComplete}
          setAnimation={setAnimation}
          setStatus={setStatus}
          courseId={courseId ?? ""}
          nextLessonId={nextLesson?.id}
        />

        {showChatArea && (
          <CourseContext
            ref={courseContextRef}
            references={sections?.references}
            documents={sections?.documents}
          />
        )}
      </div>

      <CourseCompletionModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        courseId={courseId}
      />
    </div>
  );
}
