import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";
import useChat from "@/hooks/useChat";
import useLessonPlayback from "@/hooks/useLessonPlayback";

import ChatMessage from "../ChatMessage";
import type { TMessage } from "../ChatMessage/type";
import type { TStopFn } from "../../-hooks/useTeacher";
import ChatInput from "../ChatInput";
import type { TTeacherAnimation } from "../TeacherAnimation/type";
import type { TTeacherStatus } from "../TeacherStatusIndicator/type";
import "./style.scss";

import type { SectionResponse } from "@/hooks/useLesson";

export type TChatMessageRef = {
  pause: () => void;
  resume: () => void;
  stop: () => void;
  resetAndClear: () => void;
};

type TChatMessagesProps = {
  onAnimationChange: (animation: TTeacherAnimation) => void;
  onStatusChange: (status: TTeacherStatus) => void;
  isMuted?: boolean;
  className?: string;
  mode?: "qa" | "lesson";
  sections?: SectionResponse[];
  onLessonComplete?: () => void;
  stopRef?: React.MutableRefObject<TStopFn | null>;
  lessonId?: string;
};

const ChatMessages = forwardRef<TChatMessageRef, TChatMessagesProps>(
  (props, ref) => {
    const {
      onAnimationChange,
      onStatusChange,
      isMuted = false,
      className,
      mode = "qa",
      sections = [],
      onLessonComplete,
      stopRef,
      lessonId,
    } = props;
    const { t } = useTranslation();
    const [messages, setMessages] = useState<TMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const playbackStartedRef = useRef(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);

    const scrollToBottom = useCallback(() => {
      if (isNearBottomRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, []);

    useEffect(() => {
      const sentinel = messagesEndRef.current;
      const container = messagesContainerRef.current;
      if (!sentinel || !container) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isNearBottomRef.current = entry.isIntersecting;
        },
        {
          root: container,
          rootMargin: "0px 0px 100px 0px",
        }
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    }, []);

    const chat = useChat({
      setMessages,
      onAnimationChange,
      onStatusChange,
      isMuted,
      lessonId: lessonId || "",
    });

    const {
      start: playbackStart,
      pause: playbackPause,
      resume: playbackResume,
      stop: playbackStop,
      messages: playbackMessages,
    } = useLessonPlayback({
      sections,
      onAnimationChange,
      onStatusChange,
      isMuted,
      onComplete: () => onLessonComplete?.(),
    });

    useEffect(() => {
      if (
        mode === "lesson" &&
        !playbackStartedRef.current &&
        sections.length > 0
      ) {
        playbackStartedRef.current = true;
        playbackStart();
      }
      if (mode !== "lesson") {
        playbackStartedRef.current = false;
      }
    }, [mode, sections.length, playbackStart]);

    useImperativeHandle(ref, () => {
      if (mode === "lesson") {
        return {
          pause: playbackPause,
          resume: playbackResume,
          stop: playbackStop,
          resetAndClear: () => {
            playbackStop();
            setMessages([]);
          },
        };
      }
      return {
        pause: chat.pause,
        resume: chat.resume,
        stop: chat.stop,
        resetAndClear: () => {
          chat.stop();
          setMessages([]);
        },
      };
    }, [mode, playbackPause, playbackResume, playbackStop, chat, setMessages]);

    const displayMessages = mode === "lesson" ? playbackMessages : messages;

    useLayoutEffect(() => {
      if (stopRef) {
        const stopFn = mode === "lesson" ? playbackStop : chat.stop;
        stopRef.current = stopFn;
      }
    }, [mode, playbackStop, chat.stop, stopRef]);

    useEffect(() => {
      const lastMsg = displayMessages[displayMessages.length - 1];
      if (lastMsg) {
        const el = document.getElementById(`msg-${lastMsg.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          scrollToBottom();
        }
      }
    }, [displayMessages, scrollToBottom]);

    const handleSendMessage = useCallback(
      async (content: string) => {
        const newMessage: TMessage = {
          id: crypto.randomUUID(),
          content,
          sender: "user",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, newMessage]);
        await chat.sendMessage(content);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [chat.sendMessage]
    );

    return (
      <div className={classNames("chat-messages", className)}>
        <div className="chat-messages-list" ref={messagesContainerRef}>
          {displayMessages.length === 0 ? (
            <div className="chat-messages-empty">
              <Icon name="chat" />
              <p className="chat-messages-empty-text">
                {t("chat_message_wrapper.start_conversation")}
              </p>
            </div>
          ) : (
            displayMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {mode === "qa" && (
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={t("chat_message_wrapper.placeholder_qa")}
            disabled={chat.isLoading || chat.isSpeaking}
          />
        )}
      </div>
    );
  }
);

export default ChatMessages;
