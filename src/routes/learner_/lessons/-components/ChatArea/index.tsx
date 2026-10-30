import classnames from "classnames";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "./style.scss";
import ChatHeader from "../ChatHeader";
import LessonWelcome from "../LessonWelcome";
import ChatMessages from "../ChatMessages";
import QuizPanel from "../QuizPanel";
import LessonComplete from "../LessonComplete";
import { useQuiz } from "@/hooks/useQuiz";
import type { TTeacherAnimation } from "../TeacherAnimation/type";
import type { TTeacherStatus } from "../TeacherStatusIndicator/type";
import type { TChatMessageRef } from "../ChatMessages";
import type { TStopFn } from "../../-hooks/useTeacher";

import type { SectionResponse } from "@/hooks/useLesson";

type TChatAreaProps = {
  className?: string;
  state?: "initial" | "complete" | "lesson" | "qa" | "quiz";
  lessonName?: string;
  abstract?: string | null;
  sectionCount?: number;
  sections: SectionResponse[];
  chatRef: React.RefObject<TChatMessageRef | null>;
  stopRef: React.MutableRefObject<TStopFn | null>;
  lessonId?: string;
  isMuted: boolean;
  startLesson: () => void;
  onSkipLesson: () => void;
  onSkipQA: () => void;
  onSkipQuiz: () => void;
  handleLessonComplete: () => void;
  setAnimation: (animation: TTeacherAnimation) => void;
  setStatus: (status: TTeacherStatus) => void;
  courseId?: string;
  nextLessonId?: string;
};

const ChatArea = (props: TChatAreaProps) => {
  const { t } = useTranslation();
  const [flagged, setFlagged] = useState(false);
  const {
    className,
    state,
    lessonName,
    abstract,
    sectionCount,
    sections,
    chatRef,
    stopRef,
    lessonId,
    isMuted,
    startLesson,
    onSkipLesson,
    onSkipQA,
    onSkipQuiz,
    handleLessonComplete,
    setAnimation,
    setStatus,
    courseId,
    nextLessonId,
  } = props;

  const { data: quizQuestions } = useQuiz(lessonId);
  const showChatArea = state !== "initial" && state !== "complete";

  return (
    <div className={classnames("chat-area", className)} data-lenis-prevent>
      {showChatArea && (
        <ChatHeader
          initialValue={lessonName}
          state={state}
          onSkipLesson={onSkipLesson}
          onSkipQA={onSkipQA}
          onSkipQuiz={onSkipQuiz}
          onFlag={() => {
            if (!flagged) {
              setFlagged(true);
              toast.success(t("chat_header.flagged"));
            }
          }}
          flagged={flagged}
        />
      )}

      {state === "initial" && (
        <LessonWelcome
          lessonName={lessonName}
          abstract={abstract}
          sectionCount={sectionCount}
          onStart={startLesson}
        />
      )}

      {state === "lesson" && (
        <ChatMessages
          ref={chatRef}
          mode="lesson"
          sections={sections}
          onLessonComplete={handleLessonComplete}
          onAnimationChange={setAnimation}
          onStatusChange={setStatus}
          isMuted={isMuted}
          stopRef={stopRef}
          lessonId={lessonId}
        />
      )}

      {state === "qa" && (
        <ChatMessages
          ref={chatRef}
          mode="qa"
          onAnimationChange={setAnimation}
          onStatusChange={setStatus}
          isMuted={isMuted}
          stopRef={stopRef}
          lessonId={lessonId}
        />
      )}

      {state === "quiz" && quizQuestions && (
        <QuizPanel questions={quizQuestions} onComplete={onSkipQuiz} />
      )}

      {state === "complete" && (
        <LessonComplete courseId={courseId} nextLessonId={nextLessonId} />
      )}
    </div>
  );
};

export default ChatArea;
