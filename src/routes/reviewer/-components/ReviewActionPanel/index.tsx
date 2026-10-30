import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/components/Icon";
import type { TReviewStatus } from "@/mock/reviewer-courses";
import "./style.scss";

type TReviewActionPanelProps = {
  status: TReviewStatus;
  onApprove: () => void;
  onReject: () => void;
  isPublishing?: boolean;
  isRejecting?: boolean;
};

const ReviewActionPanel = ({
  status,
  onApprove,
  onReject,
  isPublishing = false,
  isRejecting = false,
}: TReviewActionPanelProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isPending = status === "Pending";

  return (
    <div className="review-action-panel">
      <button
        type="button"
        className="review-action-panel__back"
        aria-label={t("reviewer.back_to_list")}
        onClick={() => navigate({ to: "/reviewer/courses" })}
      >
        <Icon name="arrow_back" />
        {t("reviewer.back_to_list")}
      </button>

      {!isPending && (
        <p className="review-action-panel__decided">
          {t("reviewer.already_decided", { status })}
        </p>
      )}

      <div className="review-action-panel__actions">
        <button
          type="button"
          id="btn-approve-course"
          className="review-action-panel__btn review-action-panel__btn--approve"
          onClick={onApprove}
          disabled={!isPending || isPublishing}
          aria-label={t("reviewer.approve")}
        >
          {isPublishing ? t("common.creating") : t("reviewer.approve")}
        </button>

        <button
          type="button"
          id="btn-reject-course"
          className="review-action-panel__btn review-action-panel__btn--reject"
          onClick={onReject}
          disabled={!isPending || isRejecting}
          aria-label={t("reviewer.reject")}
        >
          {isRejecting ? t("common.creating") : t("reviewer.reject")}
        </button>
      </div>
    </div>
  );
};

export default ReviewActionPanel;
