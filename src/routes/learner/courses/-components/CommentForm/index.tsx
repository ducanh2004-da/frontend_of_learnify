import classnames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import "./style.scss";

type CommentFormProps = {
  className?: string;
  initialRating?: number;
  initialContent?: string;
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const CommentForm = ({
  className,
  initialRating = 0,
  initialContent = "",
  onSubmit,
  onCancel,
  isLoading = false,
}: CommentFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const { t } = useTranslation();
  const cls = classnames("comment-form", className);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t("comment_form.toast_no_rating"));
      return;
    }
    onSubmit(rating, content.trim());
  };

  return (
    <form className={cls} onSubmit={handleSubmit}>
      <div className="comment-form-head">
        <h4 id="comment-form-rating-label">{t("comment_form.rating_label")}</h4>
        <div
          className="stars"
          role="radiogroup"
          aria-labelledby="comment-form-rating-label"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star <= rating}
              aria-label={
                star === 1
                  ? t("comment_form.star_aria", { star })
                  : t("comment_form.star_aria_plural", { star })
              }
              onClick={() => setRating(star)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRating(star);
                }
              }}
              disabled={isLoading}
            >
              <Icon
                name="star"
                className="icon"
                fill={star <= rating}
                style={{
                  color:
                    star <= rating
                      ? "var(--color-yellow-400)"
                      : "var(--color-neutral-200)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="comment-form-body">
        <label htmlFor="comment-form-textarea" className="sr-only">
          {t("comment_form.review_label")}
        </label>
        <textarea
          id="comment-form-textarea"
          placeholder={t("comment_form.placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
      </div>
      <div className="comment-form-footer">
        <TextButton
          text={t("comment_form.cancel")}
          type="outlined"
          icon="close"
          size="small"
          onClick={onCancel}
          disabled={isLoading}
          buttonType="button"
        />
        <div className="submit-btn-wrapper">
          {isLoading && <TetrisLoader size="sm" />}
          <TextButton
            text={
              isLoading
                ? (t("course_detail.processing") ?? "Submitting...")
                : t("comment_form.submit")
            }
            type="primary"
            icon="send"
            size="small"
            buttonType="submit"
            onClick={() => {}}
            disabled={isLoading || rating === 0}
          />
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
