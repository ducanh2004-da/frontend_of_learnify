import Card from "@/components/Card";
import DecorationCard from "@/components/DecorationCard";
import Empty from "@/components/Empty";
import Icon from "@/components/Icon";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { useLayout } from "@/contexts/LayoutContext";
import {
  useCourseProgress,
  useCoursePrice,
  useEnrollCourse,
  useUserEnrollments,
} from "@/hooks/useCourseDetail";
import {
  useCourseReviews,
  useCreateReviewMutation,
} from "@/hooks/useCourseReviews";
import { useCreatePayment } from "@/hooks/usePayment";
import { useAuthStore } from "@/store/authStore";
import { COLORS } from "@/styles/colors";
import type { TProgress, TStatusCard } from "@/types/global";
import { formatDate } from "@/utils";
import { normalizeRole } from "@/utils/role";
import { courseQueryOptions } from "@/utils/courses";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CommentForm from "../-components/CommentForm";
import CommentItem from "../-components/CommentItem";
import CommentSkeleton from "../-components/CommentSkeleton";

export const Route = createLazyFileRoute("/learner/courses/$courseId/")({
  component: CourseComponent,
});

function CourseComponent() {
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const { t, i18n } = useTranslation();

  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.id;

  const { data } = useSuspenseQuery(courseQueryOptions(courseId));
  const { getCourseById, getLessonsByCourseId } = data;
  const { setLayoutConfigState } = useLayout();
  const { data: coursePrice } = useCoursePrice(courseId);
  const isPaidCourse = coursePrice ? coursePrice.isFree === false : false;

  const normalizedRole = normalizeRole(currentUser?.role);
  const isInstructorOrAdmin =
    normalizedRole === "instructor" ||
    normalizedRole === "admin" ||
    normalizedRole === "reviewer" ||
    currentUser?.role === "teacher";

  useEffect(() => {
    if (getCourseById?.courseName) {
      setLayoutConfigState((prev) => ({
        ...prev,
        customTitle: getCourseById.courseName,
      }));
    }
  }, [getCourseById?.courseName, setLayoutConfigState]);

  useEffect(() => {
    if (
      getCourseById?.status &&
      getCourseById.status !== "Published" &&
      !isInstructorOrAdmin
    ) {
      toast.error(t("course_detail.private_course"));
      navigate({ to: "/learner/courses", search: { q: "" } });
    }
  }, [getCourseById?.status, isInstructorOrAdmin, navigate, t]);

  const {
    reviews,
    totalReviews,
    averageRating,
    myReview,
    isLoading: isReviewsLoading,
  } = useCourseReviews(courseId);

  const createReviewMutation = useCreateReviewMutation(courseId);
  const enrollCourseMutation = useEnrollCourse();
  const createPaymentMutation = useCreatePayment();

  const { data: enrollments, refetch: refetchEnrollments } =
    useUserEnrollments(userId);
  const { data: progressData, refetch: refetchProgress } = useCourseProgress(
    userId,
    courseId
  );

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    if (userId) {
      refetchEnrollments();
      refetchProgress();
    }
  }, [userId, refetchEnrollments, refetchProgress]);

  const isEnrolled = useMemo(() => {
    if (!enrollments) return false;
    return enrollments.some((enrollment) => enrollment.courseId === courseId);
  }, [enrollments, courseId]);

  const currentProgressPercentage = useMemo(() => {
    if (
      !isEnrolled ||
      !progressData ||
      !progressData.isSuccess ||
      !progressData.progress
    ) {
      return 0;
    }
    const firstProgress = progressData.progress[0];
    if (!firstProgress) {
      return 0;
    }

    return firstProgress.percentage;
  }, [isEnrolled, progressData]);

  const lessonsDisplay = useMemo(() => {
    if (getLessonsByCourseId?.isSuccess) {
      return getLessonsByCourseId.lessons.map((lesson, idx) => {
        let status: "default" | "locked" | "completed" = "locked";
        let percentage: TProgress = 0;

        if (isEnrolled && progressData?.progress?.[0]) {
          const completedCount = progressData.progress[0].completedLessons ?? 0;
          if (idx < completedCount) {
            status = "completed";
            percentage = 100;
          } else if (idx === completedCount) {
            status = "default";
            percentage = 0;
          }
        } else if (isEnrolled && idx === 0) {
          status = "default";
        }

        return {
          id: lesson.id,
          typeSpecial: "lesson" as const,
          title: lesson.lessonName,
          description: lesson.abstract ?? t("course_detail.no_description"),
          duration: 45,
          status,
          percentage,
        };
      });
    }
    return null;
  }, [getLessonsByCourseId, isEnrolled, progressData, t]);

  const courseDisplay = useMemo(() => {
    if (!getCourseById?.id) return null;
    let currentStatus = getCourseById.status as unknown as TStatusCard;
    if (!isEnrolled) {
      currentStatus = "locked";
    } else if (
      currentProgressPercentage > 0 &&
      currentProgressPercentage < 100
    ) {
      currentStatus = "inProgress";
    } else if (currentProgressPercentage === 100) {
      currentStatus = "completed";
    }

    return {
      title: getCourseById.courseName,
      abstract: getCourseById.abstract ?? null,
      status: currentStatus,
      listFeature: getCourseById.keyLearnings ?? [],
      percentage: currentProgressPercentage as TProgress,
    };
  }, [getCourseById, currentProgressPercentage, isEnrolled]);

  const handleEnrollCourse = useCallback(() => {
    if (!userId) {
      toast.error(t("course_detail.toast_login_enroll"));
      return;
    }
    enrollCourseMutation.mutate({ courseId });
  }, [userId, courseId, enrollCourseMutation, t]);

  const handlePayment = useCallback(() => {
    if (!userId) {
      toast.error(t("course_detail.toast_login_enroll"));
      return;
    }

    createPaymentMutation.mutate(courseId, {
      onSuccess: (data) => {
        if (data?.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      },
      onError: () => {
        toast.error(t("course_detail.payment_error"));
      },
    });
  }, [courseId, createPaymentMutation, t, userId]);

  const startButtonText = useMemo(() => {
    if (!isEnrolled) {
      if (isPaidCourse) {
        const price = coursePrice?.salePrice ?? coursePrice?.originalPrice ?? 0;
        return `${t("course_detail.buy")} - ${price.toLocaleString(i18n.language)}đ`;
      }
      return t("course_detail.enroll");
    }
    if (currentProgressPercentage >= 100) return t("course_detail.completed");
    if (currentProgressPercentage > 0) return t("course_detail.continue");
    return t("course_detail.start");
  }, [
    isEnrolled,
    currentProgressPercentage,
    t,
    isPaidCourse,
    coursePrice?.salePrice,
    coursePrice?.originalPrice,
    i18n.language,
  ]);

  const startButtonIcon = useMemo(() => {
    if (!isEnrolled) return isPaidCourse ? "shopping_cart" : "school";
    if (currentProgressPercentage >= 100) return "check";
    return "arrow_right_alt";
  }, [isEnrolled, isPaidCourse, currentProgressPercentage]);

  const handleStartClick = useCallback(() => {
    if (!isEnrolled) {
      if (isPaidCourse) {
        handlePayment();
        return;
      }
      handleEnrollCourse();
      return;
    }

    const lessons = getLessonsByCourseId?.lessons;
    if (!lessons || lessons.length === 0) return;

    if (currentProgressPercentage >= 100) {
      navigate({
        to: "/learner/lessons/$lessonId",
        params: { lessonId: lessons[lessons.length - 1]!.id },
      });
    } else if (currentProgressPercentage > 0) {
      const completedLessons =
        progressData?.progress?.[0]?.completedLessons ?? 0;
      const targetLesson = lessons[completedLessons] ?? lessons[0]!;
      navigate({
        to: "/learner/lessons/$lessonId",
        params: { lessonId: targetLesson.id },
      });
    } else {
      navigate({
        to: "/learner/lessons/$lessonId",
        params: { lessonId: lessons[0]!.id },
      });
    }
  }, [
    isEnrolled,
    isPaidCourse,
    getLessonsByCourseId,
    currentProgressPercentage,
    progressData,
    navigate,
    handleEnrollCourse,
    handlePayment,
  ]);

  const startButtonDisabled = useMemo(() => {
    if (!isEnrolled) {
      if (isPaidCourse) return createPaymentMutation.isPending;
      return enrollCourseMutation.isPending;
    }
    return false;
  }, [
    isEnrolled,
    isPaidCourse,
    createPaymentMutation.isPending,
    enrollCourseMutation.isPending,
  ]);

  const handleLessonClick = (lessonId: string, isLocked: boolean) => {
    if (!isEnrolled) {
      toast.warning(t("course_detail.toast_enroll_first"));
      return;
    }
    if (isLocked) {
      toast.warning(t("course_detail.toast_unlock_lesson"));
      return;
    }
    navigate({
      to: "/learner/lessons/$lessonId",
      params: { lessonId },
    });
  };

  const handleReviewSubmit = async (rating: number, content?: string) => {
    try {
      const response = await createReviewMutation.mutateAsync({
        courseId,
        rating,
        content,
        userId,
      });

      if (response?.isSuccess) {
        setShowCommentForm(false);
        setShowComment(true);
      }
    } catch {
      // Error handled via toast in hook; form text preserved
    }
  };

  const bannerStarDisplay = useMemo(() => {
    if (totalReviews > 0) {
      return `${averageRating} (${totalReviews})`;
    }
    return 0;
  }, [averageRating, totalReviews]);

  if (!courseDisplay) return <NotFound />;

  if (!lessonsDisplay)
    return (
      <Empty>
        <Empty.Header>
          <Empty.Media variant="icon">
            <Icon name="sell" />
          </Empty.Media>
          <Empty.Title>{t("course_detail.empty_title")}</Empty.Title>
          <Empty.Description>
            {t("course_detail.empty_description")}
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <TextButton
            text={t("course_detail.empty_create")}
            icon="add"
            size="medium"
            onClick={() => {}}
          />
        </Empty.Content>
      </Empty>
    );

  return (
    <div className="course__container">
      <Suspense fallback={<TetrisLoader />}>
        <div className="course__item-list">
          <DecorationCard
            listBadge={
              <>
                <TextButton
                  text={t("course_detail.badge_text")}
                  size="tiny"
                  type="special"
                  typeSpecial="course"
                  backgroundColor={COLORS.navy500}
                  color={COLORS.neutral100}
                  onClick={() => {}}
                />
                <TextButton
                  text={t(
                    getCourseById?.status === "Published"
                      ? "course_detail.public_status"
                      : "course_detail.private_status"
                  )}
                  size="tiny"
                  type="special"
                  typeSpecial={
                    getCourseById?.status === "Published" ? "public" : "private"
                  }
                  backgroundColor={COLORS.grey}
                  color={COLORS.neutral100}
                  onClick={() => {}}
                />
              </>
            }
            typeSpecial="course"
            title={courseDisplay.title}
            status={courseDisplay.status}
            listFeature={courseDisplay.listFeature}
            percentage={courseDisplay.percentage}
            star={bannerStarDisplay}
            onStartClick={handleStartClick}
            startText={startButtonText}
            startIcon={startButtonIcon}
            startDisabled={startButtonDisabled}
          />
          {courseDisplay.abstract && (
            <p className="course__abstract">{courseDisplay.abstract}</p>
          )}
          <div className="course__controller">
            <TextButton
              text={
                showComment
                  ? (t("course_detail.hide_feedback") ?? "Hide feedback")
                  : totalReviews > 0
                    ? `${t("course_detail.show_feedback")} (${totalReviews})`
                    : t("course_detail.show_feedback")
              }
              size="small"
              icon="feedback"
              type={showComment ? "secondary" : "outlined"}
              typeSpecial="course"
              onClick={() => setShowComment((prev) => !prev)}
            />
          </div>
          <div className="course__list">
            {lessonsDisplay.map((lesson) => (
              <Card
                key={lesson.id}
                typeSpecial={lesson.typeSpecial}
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                status={lesson.status}
                percentage={lesson.percentage}
                onClick={() =>
                  handleLessonClick(lesson.id, lesson.status === "locked")
                }
                disabled={lesson.status === "locked"}
              />
            ))}
          </div>
        </div>
      </Suspense>
      <Activity mode={showComment ? "visible" : "hidden"}>
        <div className="course__comment">
          {/* Feedback Form / Your Review widget */}
          {myReview && !showCommentForm ? (
            <div className="course__my-review-card">
              <div className="course__my-review-header">
                <div className="course__my-review-title-group">
                  <span className="course__my-review-badge">
                    {t("course_detail.your_review") ?? "Your Review"}
                  </span>
                  <div className="course__my-review-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icon
                        key={s}
                        name="star"
                        className="icon"
                        style={{
                          color: s <= myReview.rating ? "#FFC107" : "#E0E0E0",
                          fontSize: "16px",
                        }}
                        fill={s <= myReview.rating}
                      />
                    ))}
                  </div>
                </div>
                <TextButton
                  text={t("course_detail.edit_review") ?? "Edit"}
                  size="tiny"
                  icon="edit"
                  type="outlined"
                  onClick={() => setShowCommentForm(true)}
                />
              </div>
              {myReview.content && (
                <p className="course__my-review-content">{myReview.content}</p>
              )}
              <span className="course__my-review-date">
                {formatDate(myReview.createdAt)}
              </span>
            </div>
          ) : !showCommentForm ? (
            <TextButton
              text={t("course_detail.send_feedback")}
              size="small"
              icon="add"
              type="outlined"
              typeSpecial="course"
              className="course__send-btn"
              onClick={() => {
                if (!currentUser) {
                  toast.warning(t("course_detail.toast_login_feedback"));
                  return;
                }
                setShowCommentForm(true);
              }}
            />
          ) : null}

          {/* Comment Form when editing or creating */}
          <Activity mode={showCommentForm ? "visible" : "hidden"}>
            <CommentForm
              key={myReview?.id ? `edit-${myReview.id}` : "new-review"}
              initialRating={myReview?.rating || 0}
              initialContent={myReview?.content || ""}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowCommentForm(false)}
              isLoading={createReviewMutation.isPending}
            />
          </Activity>

          {/* Reviews List */}
          {isReviewsLoading ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : reviews.length === 0 ? (
            <div className="course__reviews-empty">
              <Icon name="feedback" className="course__reviews-empty-icon" />
              <p className="course__reviews-empty-text">
                {t("course_detail.no_reviews") ??
                  "No reviews yet. Be the first to rate this course!"}
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <CommentItem
                key={review.id}
                userName={review.user?.username || "Anonymous"}
                avatar={review.user?.avatar}
                time={formatDate(review.createdAt)}
                rating={review.rating}
                content={review.content}
                isCurrentUser={Boolean(userId && review.user?.id === userId)}
              />
            ))
          )}
        </div>
      </Activity>
    </div>
  );
}
