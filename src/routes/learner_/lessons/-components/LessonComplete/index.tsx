import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import { useIncreaseStreakMutation } from "@/hooks/useGamification";
import { logger } from "@/utils/logger";
import "./style.scss";

type TLessonCompleteProps = {
  courseId?: string;
  nextLessonId?: string;
};

const LessonComplete = ({ courseId, nextLessonId }: TLessonCompleteProps) => {
  const { t } = useTranslation();
  const hasUpdatedStreakRef = useRef(false);

  const { mutate: increaseStreak } = useIncreaseStreakMutation({
    onError: (error) => {
      logger.error("Failed to increase streak on lesson complete:", error);
    },
  });

  useEffect(() => {
    if (hasUpdatedStreakRef.current) return;
    hasUpdatedStreakRef.current = true;
    increaseStreak();
  }, [increaseStreak]);

  return (
    <div className="lesson-complete">
      <Icon name="check_circle" className="lesson-complete__icon" />
      <h2 className="lesson-complete__title">{t("lesson_complete.title")}</h2>
      <p className="lesson-complete__text">
        {t("lesson_complete.description")}
      </p>
      <div className="lesson-complete__actions">
        {courseId ? (
          <Link
            to="/learner/courses/$courseId"
            params={{ courseId }}
            className="lesson-complete__back"
          >
            <Icon name="arrow_back" className="lesson-complete__back-icon" />
            {t("lesson_complete.back_to_course")}
          </Link>
        ) : (
          <Link to="/learner/dashboard" className="lesson-complete__back">
            {t("lesson_complete.back_to_dashboard")}
          </Link>
        )}
        {nextLessonId ? (
          <Link
            to="/learner/lessons/$lessonId"
            params={{ lessonId: nextLessonId }}
            className="lesson-complete__next"
          >
            <Icon name="arrow_forward" className="lesson-complete__next-icon" />
            {t("lesson_complete.next_lesson")}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default LessonComplete;
