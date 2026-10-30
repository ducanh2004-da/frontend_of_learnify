import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import {
  MARK_COMPLETE_LESSON_MUTATION,
  UPDATE_PROGRESS_MUTATION,
  CURRENT_USER_QUERY,
} from "@/graphql/mutations";
import { useCourseProgress } from "@/hooks/useCourseDetail";
import { useAuthStore } from "@/store";
import type { TLessonState } from "@/hooks/useLessonFlow";

export const STATE_TO_PERCENTAGE: Record<TLessonState, number> = {
  initial: 0,
  lesson: 10,
  qa: 33,
  quiz: 66,
  complete: 100,
};

export function useLessonProgress(
  state: TLessonState,
  lessonId: string,
  courseId?: string
) {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: progressData } = useCourseProgress(userId, courseId);
  const queryClient = useQueryClient();

  const progressPercentage = STATE_TO_PERCENTAGE[state];

  const progressId = progressData?.progress?.[0]?.id;
  const completedLessons = progressData?.progress?.[0]?.completedLessons ?? 0;
  const totalLessons = progressData?.progress?.[0]?.totalLessons ?? 0;
  const lastCompletedLessonId =
    progressData?.progress?.[0]?.lastCompletedLessonId;
  const isAlreadyCompleted = lastCompletedLessonId === lessonId;

  const DIAMOND_PER_LESSON = 5;
  const COURSE_COMPLETION_DIAMONDS = 10;

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !lessonId) return;
      return graphqlClient.request(MARK_COMPLETE_LESSON_MUTATION, {
        input: { userId, lessonId },
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });
      try {
        const response = await graphqlClient.request<{
          currentUser: {
            isSuccess: boolean;
            users: Array<{ diamond?: number; currentSteak?: number }>;
          };
        }>(CURRENT_USER_QUERY);
        if (response.currentUser.isSuccess && response.currentUser.users[0]) {
          const fresh = response.currentUser.users[0]!;
          const current = useAuthStore.getState().user;
          if (current) {
            useAuthStore.getState().setAuth({
              ...current,
              diamond: fresh.diamond ?? current.diamond,
              currentSteak: fresh.currentSteak ?? current.currentSteak,
            });
          }
        }
      } catch (err) {
        console.warn(
          "Failed to refresh user data after lesson completion",
          err
        );
      }
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (newCompleted: number) => {
      if (!userId || !courseId || !progressId) return;
      return graphqlClient.request(UPDATE_PROGRESS_MUTATION, {
        input: {
          userId,
          progressId,
          completedLessons: Math.min(newCompleted, totalLessons),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });
    },
  });

  const isCourseCompleted =
    !isAlreadyCompleted &&
    totalLessons > 0 &&
    completedLessons + 1 >= totalLessons;

  const handleComplete = () => {
    if (!userId || !lessonId) return;

    const current = useAuthStore.getState().user;
    if (current) {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem("lastStreakDate");
      const newStreak =
        lastDate === today
          ? (current.currentSteak ?? 0)
          : (current.currentSteak ?? 0) + 1;

      if (!isAlreadyCompleted) {
        const lessonDiamonds =
          DIAMOND_PER_LESSON +
          (isCourseCompleted ? COURSE_COMPLETION_DIAMONDS : 0);
        useAuthStore.getState().setAuth({
          ...current,
          diamond: (current.diamond ?? 0) + lessonDiamonds,
          currentSteak: newStreak,
        });
      }

      if (lastDate !== today) {
        localStorage.setItem("lastStreakDate", today);
      }
    }

    markCompleteMutation.mutate();
    if (courseId && progressId) {
      updateProgressMutation.mutate(completedLessons + 1);
    }
  };

  return {
    progressPercentage,
    handleComplete,
    isCourseCompleted,
  };
}
