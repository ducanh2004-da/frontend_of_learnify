import { useMemo, useEffect } from "react";
import { useLesson, type TLessonData } from "@/hooks/useLesson";
import useLessonFlow from "@/hooks/useLessonFlow";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useLayout } from "@/contexts/LayoutContext";

export type TLessonDetail = {
  data: TLessonData | undefined;
  isLoading: boolean;
  state: ReturnType<typeof useLessonFlow>["state"];
  sections:
    | {
        references: { value: string; label: string }[];
        documents: { value: string; label: string }[];
      }
    | undefined;
  startLesson: () => void;
  skipToQA: () => void;
  skipToQuiz: () => void;
  completeLesson: () => void;
  reset: () => void;
  progressPercentage: number;
  handleComplete: () => void;
  isCourseCompleted: boolean;
};

const useLessonDetail = (
  lessonId: string,
  initialData?: TLessonData
): TLessonDetail => {
  const { data, isLoading } = useLesson(lessonId, initialData);
  const resolvedData = data || (initialData?.lesson ? initialData : undefined);
  const resolvedLoading = isLoading && !resolvedData?.lesson;

  const { state, startLesson, skipToQA, skipToQuiz, completeLesson, reset } =
    useLessonFlow();
  const courseId = resolvedData?.lesson?.courseId;
  const { progressPercentage, handleComplete, isCourseCompleted } =
    useLessonProgress(state, lessonId, courseId);
  const { setLayoutConfigState } = useLayout();

  const title =
    resolvedData?.course?.courseName || resolvedData?.lesson?.lessonName;

  useEffect(() => {
    if (title) {
      setLayoutConfigState((prev) => ({ ...prev, customTitle: title }));
    }
  }, [title, setLayoutConfigState]);

  const sections = useMemo(() => {
    if (!resolvedData?.sections) return undefined;
    const refs = resolvedData.sections
      .filter((s) => s.content)
      .map((s) => ({ value: s.id, label: s.content! }));
    const docs = resolvedData.sections
      .filter((s) => s.urlPdf)
      .map((s) => ({
        value: s.id,
        label: s.urlPdf.split("/").pop() || "Document",
      }));
    return { references: refs, documents: docs };
  }, [resolvedData]);

  return {
    data: resolvedData,
    isLoading: resolvedLoading,
    state,
    sections,
    startLesson,
    skipToQA,
    skipToQuiz,
    completeLesson,
    reset,
    progressPercentage,
    handleComplete,
    isCourseCompleted,
  };
};

export default useLessonDetail;
