import { useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql";
import { useAuthStore } from "@/store/authStore";
import {
  GET_REVIEWS_BY_COURSE_QUERY,
  CREATE_REVIEW_MUTATION,
  type Review,
  type ReviewResponse,
  type GetReviewsByCourseResponse,
  type CreateReviewResponse,
  type CreateReviewInput,
} from "@/graphql/review";

export type CreateReviewVariables = {
  courseId?: string;
  rating: number;
  content?: string | null;
  userId?: string;
};

/**
 * Fetches reviews for a given course ID, sorted newest first.
 * Calculates totalReviews, averageRating (1 decimal place or 0), and finds myReview based on auth state.
 */
export function useCourseReviews(
  courseId: string,
  options?: Omit<
    UseQueryOptions<ReviewResponse | null, Error, ReviewResponse | null>,
    "queryKey" | "queryFn" | "enabled"
  >
) {
  const currentUserId = useAuthStore((state) => state.user?.id);

  const query = useQuery({
    queryKey: ["courseReviews", courseId],
    queryFn: async () => {
      const response = await graphqlClient.request<GetReviewsByCourseResponse>(
        GET_REVIEWS_BY_COURSE_QUERY,
        { courseId }
      );
      return response.getReviewsByCourse;
    },
    enabled: Boolean(courseId),
    ...options,
  });

  const reviews = useMemo<Review[]>(() => {
    const raw = query.data?.reviews ? [...query.data.reviews] : [];
    return raw.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [query.data]);

  const totalReviews = reviews.length;

  const averageRating = useMemo<number>(() => {
    if (reviews.length === 0) return 0;
    const totalScore = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((totalScore / reviews.length) * 10) / 10;
  }, [reviews]);

  const myReview = useMemo<Review | null>(() => {
    if (!currentUserId) return null;
    return reviews.find((review) => review.user?.id === currentUserId) ?? null;
  }, [reviews, currentUserId]);

  return {
    query,
    data: query.data,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    reviews,
    totalReviews,
    averageRating,
    myReview,
  };
}

/**
 * Mutation hook to create a new review for a course.
 * On success, checks isSuccess and invalidates ['courseReviews', courseId]
 * and ['course-detail', courseId] to update review lists and average rating badges immediately.
 */
export function useCreateReviewMutation(
  courseId: string,
  options?: Omit<
    UseMutationOptions<
      ReviewResponse,
      Error,
      CreateReviewVariables | CreateReviewInput
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (
      variables: CreateReviewVariables | CreateReviewInput
    ) => {
      const targetCourseId = variables.courseId || courseId;
      const payload: {
        courseId: string;
        rating: number;
        content?: string;
      } = {
        courseId: targetCourseId,
        rating: variables.rating,
      };

      if (variables.content !== undefined && variables.content !== null) {
        payload.content = variables.content;
      }

      const response = await graphqlClient.request<CreateReviewResponse>(
        CREATE_REVIEW_MUTATION,
        { data: payload }
      );

      return response.createReview;
    },
    onSuccess: async (...args) => {
      const [data, variables] = args;
      const targetCourseId = variables?.courseId || courseId;

      if (data?.isSuccess) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["courseReviews", targetCourseId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["course-detail", targetCourseId],
          }),
        ]);
        toast.success(data.message || "Review submitted successfully");
      } else if (data && !data.isSuccess) {
        toast.error(data.message || "Failed to submit review");
      }

      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to submit review");
      options?.onError?.(...args);
    },
  });
}
