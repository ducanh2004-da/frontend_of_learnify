import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TTeacherAnimation } from "@/routes/learner_/lessons/-components/TeacherAnimation/type";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import type { TMessage } from "@/routes/learner_/lessons/-components/ChatMessage/type";
import { graphqlClient } from "@/lib/graphql";
import { ASK_LESSON_QUESTION_QUERY } from "@/graphql/course";
import { TALKING_ANIMATIONS } from "@/mock/chats";

const randomFrom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

type TTeacherStatus = "idle" | "thinking" | "speaking" | "paused";

type TUseChatProps = {
  setMessages: React.Dispatch<React.SetStateAction<TMessage[]>>;
  onAnimationChange: (animation: TTeacherAnimation) => void;
  onStatusChange: (status: TTeacherStatus) => void;
  isMuted?: boolean;
  lessonId: string;
};

type TUseChatReturn = {
  sendMessage: (question: string) => Promise<void>;
  isLoading: boolean;
  isSpeaking: boolean;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

const useChat = (props: TUseChatProps): TUseChatReturn => {
  const {
    setMessages,
    onAnimationChange,
    onStatusChange,
    isMuted = false,
    lessonId,
  } = props;
  const {
    speak,
    stop: stopSpeech,
    pause,
    resume,
    isSpeaking,
  } = useSpeechSynthesis();
  const [isLoading, setIsLoading] = useState(false);
  const isSpeakingRef = useRef(isSpeaking);
  const isMutedRef = useRef(isMuted);
  const { t } = useTranslation();

  const thinkingTexts = useMemo(
    () => [
      t("chat.thinking.the_teacher_is_thinking"),
      t("chat.thinking.processing_your_question"),
      t("chat.thinking.let_me_check"),
      t("chat.thinking.searching_knowledge_base"),
      t("chat.thinking.analyzing_your_query"),
    ],
    [t]
  );

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const sendMessage = useCallback(
    async (question: string) => {
      setIsLoading(true);
      onStatusChange("thinking");
      onAnimationChange("Thinking");

      const thinkingId = Date.now().toString();
      const thinkingContent = randomFrom(thinkingTexts);

      const thinkingMessage: TMessage = {
        id: thinkingId,
        content: thinkingContent,
        sender: "teacher",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, thinkingMessage]);

      try {
        const response = await graphqlClient.request<{
          askLessonQuestion: string[];
        }>(ASK_LESSON_QUESTION_QUERY, {
          lessonId,
          question,
        });

        const paragraphs = response.askLessonQuestion;
        const answer =
          (paragraphs && paragraphs.length > 0
            ? paragraphs.join("\n\n")
            : null) || "Sorry, I couldn't process your question right now.";

        const speakText = paragraphs ? paragraphs.join(" ") : answer;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === thinkingId ? { ...msg, content: "" } : msg
          )
        );

        onAnimationChange(randomFrom(TALKING_ANIMATIONS));

        let speakPromise: Promise<unknown> | null = null;

        let progressInterval: ReturnType<typeof setInterval> | null = null;

        if (!isMutedRef.current) {
          onStatusChange("speaking");
          speakPromise = speak(speakText);
        } else {
          speakPromise = new Promise<void>((resolve) =>
            setTimeout(resolve, 3000)
          );
        }

        let charIdx = 0;
        const charIntervalMs = Math.max(15, Math.min(60, 1000 / 25));

        progressInterval = setInterval(() => {
          charIdx++;
          if (charIdx >= speakText.length) {
            if (progressInterval) clearInterval(progressInterval);
            return;
          }
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === thinkingId
                ? { ...msg, content: speakText.slice(0, charIdx) }
                : msg
            )
          );
        }, charIntervalMs);

        await speakPromise;
        if (progressInterval) clearInterval(progressInterval);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === thinkingId ? { ...msg, content: answer } : msg
          )
        );

        onStatusChange("idle");
        onAnimationChange("Idle");
      } catch {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === thinkingId
              ? {
                  ...msg,
                  content: "Sorry, I couldn't process your question right now.",
                }
              : msg
          )
        );
        onStatusChange("idle");
        onAnimationChange("Idle");
      } finally {
        setIsLoading(false);
      }
    },
    [
      setMessages,
      onAnimationChange,
      onStatusChange,
      speak,
      lessonId,
      thinkingTexts,
    ]
  );

  const handleStop = useCallback(() => {
    stopSpeech();
    onStatusChange("idle");
    onAnimationChange("Idle");
    setIsLoading(false);
  }, [stopSpeech, onStatusChange, onAnimationChange]);

  const handlePause = useCallback(() => {
    pause();
    onStatusChange("paused");
  }, [pause, onStatusChange]);

  const handleResume = useCallback(() => {
    resume();
    onStatusChange("speaking");
  }, [resume, onStatusChange]);

  return {
    sendMessage,
    isLoading,
    isSpeaking,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
  };
};

export default useChat;
