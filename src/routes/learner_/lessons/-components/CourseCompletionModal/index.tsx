import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useAuthStore } from "@/store";
import { useUpdateDiamondsMutation } from "@/hooks/useGamification";
import { logger } from "@/utils/logger";
import "./style.scss";

type TCourseCompletionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
};

const CourseCompletionModal = ({
  isOpen,
  onClose,
  courseId: _courseId,
}: TCourseCompletionModalProps) => {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.user);
  const userId = currentUser?.id;

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rewardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const hasRewardedRef = useRef(false);

  const { mutate: updateDiamonds, isPending } = useUpdateDiamondsMutation({
    onError: (error) => {
      logger.error("Failed to update diamonds on course completion:", error);
    },
  });

  useEffect(() => {
    if (!isOpen || !userId || hasRewardedRef.current) return;
    hasRewardedRef.current = true;
    updateDiamonds({
      data: {
        userId,
        amount: 10,
        transactionType: "EARN",
        source: "SYSTEM_STREAK",
      },
    });
  }, [isOpen, userId, updateDiamonds]);

  useEffect(() => {
    if (!isOpen) return;

    const tl = gsap.timeline();

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
      .fromTo(
        panelRef.current,
        { scale: 0.7, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      )
      .fromTo(
        diamondRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
        "-=0.3"
      )
      .fromTo(
        [
          titleRef.current,
          subtitleRef.current,
          rewardRef.current,
          btnRef.current,
        ],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="course-completion-overlay" ref={overlayRef}>
      <div className="course-completion-modal" ref={panelRef}>
        <div className="course-completion-modal__diamond-wrap" ref={diamondRef}>
          <svg
            viewBox="0 -960 960 960"
            width={64}
            height={64}
            fill="currentColor"
            className="course-completion-modal__diamond"
          >
            <path d="M480-80 80-480l400-400 400 400-400 400Zm0-112 288-288-288-288-288 288 288 288Z" />
          </svg>
          <div className="course-completion-modal__sparkles">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="course-completion-modal__sparkle"
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        <h2 className="course-completion-modal__title" ref={titleRef}>
          {t("course_completion.title")}
        </h2>
        <p className="course-completion-modal__subtitle" ref={subtitleRef}>
          {t("course_completion.subtitle")}
        </p>

        <div className="course-completion-modal__reward" ref={rewardRef}>
          <svg
            viewBox="0 -960 960 960"
            width={20}
            height={20}
            fill="currentColor"
          >
            <path d="M480-80 80-480l400-400 400 400-400 400Zm0-112 288-288-288-288-288 288 288 288Z" />
          </svg>
          <span>{t("course_completion.diamonds_earned")}</span>
        </div>

        <button
          type="button"
          className="course-completion-modal__btn"
          ref={btnRef}
          onClick={onClose}
          disabled={isPending}
        >
          {isPending
            ? t("tetris_loader.loading", "Loading...")
            : t("course_completion.continue")}
        </button>
      </div>
    </div>
  );
};

export default CourseCompletionModal;
