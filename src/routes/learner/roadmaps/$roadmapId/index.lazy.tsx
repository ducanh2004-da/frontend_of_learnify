import Card from "@/components/Card";
import DecorationCard from "@/components/DecorationCard";
import Empty from "@/components/Empty";
import Icon from "@/components/Icon";
import NotFound from "@/components/NotFound";
import TextButton from "@/components/TextButton";
import { useLayout } from "@/contexts/LayoutContext";
import { useCreateReview } from "@/hooks/useCourseDetail";
import { MOCK_COMMENT } from "@/mock";
import { useAuthStore } from "@/store/authStore";
import { COLORS } from "@/styles/colors";
import type { TProgress, TStatusCard } from "@/types/global";
import { roadmapQueryOptions } from "@/utils/roadmaps";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CommentItem from "../-components/CommentItem";
import CommentForm from "../../courses/-components/CommentForm";
import TetrisLoader from "@/components/TetrisLoader";

export const Route = createLazyFileRoute("/learner/roadmaps/$roadmapId/")({
  component: RoadmapItem,
});

function RoadmapItem() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roadmapId } = Route.useParams();

  const currentUser = useAuthStore((state) => state.user);
  const { setLayoutConfigState } = useLayout();

  const { data } = useSuspenseQuery(roadmapQueryOptions(roadmapId));
  const roadmapDetail = data.getRoadmapById.roadmap[0]!;

  useEffect(() => {
    if (roadmapDetail?.roadMapName) {
      setLayoutConfigState((prev) => ({
        ...prev,
        customTitle: roadmapDetail.roadMapName,
      }));
    }
  }, [roadmapDetail?.roadMapName, setLayoutConfigState]);

  const createReview = useCreateReview();

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const displayCourses = useMemo(
    () =>
      roadmapDetail.courses.map((course) => ({
        id: course.id,
        typeSpecial: "course" as const,
        title: course.courseName,
        description: course.abstract ?? t("course_detail.no_description"),
        duration: 45,
        status: (course.status.toLowerCase() === "published"
          ? "default"
          : "locked") as TStatusCard,
        percentage: 0 as TProgress,
      })),
    [roadmapDetail, t]
  );

  const commentDisplay = useMemo(
    () =>
      MOCK_COMMENT.map((comment) => ({
        id: String(comment.id),
        userName: comment.userName,
        time: comment.time,
        rating: comment.rating,
        content: comment.content,
      })),
    []
  );

  const roadmapDisplay = useMemo(() => {
    if (!roadmapDetail?.id) return null;
    return {
      title: roadmapDetail.roadMapName,
      abstract: roadmapDetail.abstract ?? null,
      status: "default" as TStatusCard,
      listFeature: [] as string[],
      percentage: 0 as TProgress,
    };
  }, [roadmapDetail]);

  if (!roadmapDisplay) return <NotFound />;

  if (!displayCourses.length)
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
      </Empty>
    );

  return (
    <div className="roadmap__container">
      <Suspense fallback={<TetrisLoader />}>
        <div className="roadmap__item-list">
          <DecorationCard
            listBadge={
              <TextButton
                text={t("course_detail.badge_text")}
                size="tiny"
                type="special"
                typeSpecial="roadmap"
                backgroundColor={COLORS.navy300}
                color={COLORS.neutral100}
                onClick={() => {}}
              />
            }
            typeSpecial="roadmap"
            backgroundColor={COLORS.modeGreen}
            title={roadmapDisplay.title}
            status={roadmapDisplay.status}
            listFeature={roadmapDisplay.listFeature}
            percentage={roadmapDisplay.percentage}
          />
          {roadmapDisplay.abstract && (
            <p className="roadmap__abstract">{roadmapDisplay.abstract}</p>
          )}
          <div className="roadmap__controller">
            <TextButton
              text={t("course_detail.show_feedback")}
              size="small"
              icon="feedback"
              type="outlined"
              typeSpecial="course"
              onClick={() => setShowComment((prev) => !prev)}
            />
          </div>
          <div className="roadmap__list">
            {displayCourses.map((course) => (
              <Card
                key={course.id}
                typeSpecial={course.typeSpecial}
                title={course.title}
                description={course.description}
                duration={course.duration}
                status={course.status}
                percentage={course.percentage}
                onClick={() =>
                  navigate({
                    to: "/learner/courses/$courseId",
                    params: { courseId: course.id.toString() },
                  })
                }
              />
            ))}
          </div>
        </div>
      </Suspense>
      <Activity mode={showComment ? "visible" : "hidden"}>
        <div className="roadmap__comment">
          <TextButton
            text={t("course_detail.send_feedback")}
            size="small"
            icon="add"
            type="outlined"
            typeSpecial="course"
            className="roadmap__send-btn"
            onClick={() => {
              if (!currentUser) {
                toast.warning(t("course_detail.toast_login_feedback"));
                return;
              }
              setShowCommentForm((prev) => !prev);
            }}
          />
          <Activity mode={showCommentForm ? "visible" : "hidden"}>
            <CommentForm
              onSubmit={(rating, content) => {
                createReview.mutate(
                  { courseId: roadmapId, rating, content },
                  { onSuccess: () => setShowCommentForm(false) }
                );
              }}
              onCancel={() => setShowCommentForm(false)}
              isLoading={createReview.isPending}
            />
          </Activity>
          {commentDisplay.map((comment) => (
            <CommentItem
              key={comment.id}
              userName={comment.userName}
              time={comment.time}
              rating={comment.rating}
              content={comment.content}
            />
          ))}
        </div>
      </Activity>
    </div>
  );
}
