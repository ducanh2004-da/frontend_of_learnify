import { useState, useEffect, useRef, useCallback } from "react";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import type { TMessage } from "@/routes/learner_/lessons/-components/ChatMessage/type";
import type { TTeacherAnimation } from "@/routes/learner_/lessons/-components/TeacherAnimation/type";
import { TALKING_ANIMATIONS } from "@/mock/chats";
import { logger } from "@/utils/logger";

import type { SectionResponse } from "@/hooks/useLesson";

type TTeacherStatus = "idle" | "thinking" | "speaking" | "paused";

type TUseLessonPlaybackProps = {
  sections: SectionResponse[];
  onAnimationChange: (animation: TTeacherAnimation) => void;
  onStatusChange: (status: TTeacherStatus) => void;
  isMuted?: boolean;
  onComplete: () => void;
};

type TUseLessonPlaybackReturn = {
  messages: TMessage[];
  isPlaying: boolean;
  isSpeaking: boolean;
  start: () => void;
  skipToEnd: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

const randomFrom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

const SEGMENT_DELAY = 1000;

const useLessonPlayback = (
  props: TUseLessonPlaybackProps
): TUseLessonPlaybackReturn => {
  const {
    sections,
    onAnimationChange,
    onStatusChange,
    isMuted = false,
    onComplete,
  } = props;
  const {
    speak,
    prefetch,
    stop: stopSpeech,
    pause: pauseSpeech,
    resume: resumeSpeech,
    isSpeaking,
  } = useSpeechSynthesis();

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const isPlayingRef = useRef(false);
  const sectionIdxRef = useRef(0);
  const segmentIdxRef = useRef(0);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    logger.debug(
      `[playback] sync isPlayingRef: ${isPlayingRef.current} -> ${isPlaying}`
    );
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const buildMessages = useCallback((): TMessage[] => {
    const result: TMessage[] = [];
    let idx = 0;
    for (const section of sections) {
      const segs = section.lecturer_segment;
      logger.debug(
        `[playback] section ${section.order}: urlPdf=${section.urlPdf?.slice(0, 40)}, lecturer_segment=${JSON.stringify(segs)}, isArray=${Array.isArray(segs)}`
      );
      result.push({
        id: `section-img-${section.id}`,
        content: `Section ${section.order}`,
        sender: "teacher",
        timestamp: new Date(),
        type: "image",
        imageUrl: section.urlPdf,
      });
      for (const segment of segs || []) {
        result.push({
          id: `section-seg-${section.id}-${idx}`,
          content: segment,
          sender: "teacher",
          timestamp: new Date(),
          type: "text",
        });
        idx++;
      }
    }
    logger.debug(
      `[playback] buildMessages: ${result.length} total messages from ${sections.length} sections`
    );
    return result;
  }, [sections]);

  const processNext = useCallback(async () => {
    logger.debug(
      `[playback] processNext start | cancelled=${cancelledRef.current} | isPlaying=${isPlayingRef.current}`
    );
    if (cancelledRef.current || !isPlayingRef.current) return;

    const flatMessages = buildMessages();
    const allSegmentTexts = sections.flatMap((s) => s.lecturer_segment || []);
    let segTextIdx = 0;
    let flatIdx = 0;
    logger.debug(
      `[playback] processNext loop: ${sections.length} sections, ${flatMessages.length} flat messages`
    );
    for (let s = 0; s < sections.length; s++) {
      if (cancelledRef.current || !isPlayingRef.current) {
        logger.debug(`[playback] aborted at section ${s}`);
        return;
      }
      sectionIdxRef.current = s;

      const section = sections[s]!;
      const imgMsg = flatMessages[flatIdx];
      if (imgMsg) {
        logger.debug(
          `[playback] push image msg idx=${flatIdx} id=${imgMsg.id}`
        );
        setMessages((prev) => [...prev, imgMsg]);
      }
      flatIdx++;

      const segments = section.lecturer_segment || [];
      logger.debug(`[playback] section ${s}: ${segments.length} segments`);
      for (let seg = 0; seg < segments.length; seg++) {
        if (cancelledRef.current || !isPlayingRef.current) {
          logger.debug(`[playback] aborted at seg ${seg}`);
          return;
        }
        segmentIdxRef.current = seg;

        logger.debug(`[playback] awaiting delay ${SEGMENT_DELAY}ms`);
        await new Promise<void>((resolve) => {
          delayRef.current = setTimeout(resolve, SEGMENT_DELAY);
        });

        if (cancelledRef.current || !isPlayingRef.current) {
          logger.debug("[playback] aborted after delay");
          return;
        }

        const segMsg = flatMessages[flatIdx];
        if (segMsg) {
          logger.debug(
            `[playback] push seg msg idx=${flatIdx} content=${segMsg.content?.slice(0, 40)}`
          );
          setMessages((prev) => [...prev, segMsg]);
        }
        flatIdx++;

        onAnimationChange(randomFrom(TALKING_ANIMATIONS));
        onStatusChange("speaking");

        if (!isMutedRef.current) {
          const segmentText = segments[seg];
          logger.debug(`[playback] speak: "${segmentText?.slice(0, 40)}"`);
          if (segmentText) {
            const nextText = allSegmentTexts[segTextIdx + 1];
            if (nextText) prefetch(nextText);
            await speak(segmentText);
          }
        } else {
          const segmentText = segments[seg];
          const estimatedDuration = Math.max(
            1,
            (segmentText?.length || 10) / 2.5
          );
          logger.debug(
            `[playback] muted - keeping talking animation for ${estimatedDuration.toFixed(1)}s`
          );
          await new Promise<void>((resolve) => {
            delayRef.current = setTimeout(resolve, estimatedDuration * 1000);
          });
        }
        segTextIdx++;

        logger.debug(
          `[playback] check after speak: cancelled=${cancelledRef.current} isPlaying=${isPlayingRef.current}`
        );
        if (cancelledRef.current || !isPlayingRef.current) {
          logger.debug("[playback] aborted after speak");
          return;
        }
        onAnimationChange("Idle");
        onStatusChange("idle");
      }
    }

    logger.debug("[playback] all sections done, calling onComplete");
    setIsPlaying(false);
    isPlayingRef.current = false;
    onComplete();
  }, [
    sections,
    buildMessages,
    speak,
    prefetch,
    onAnimationChange,
    onStatusChange,
    onComplete,
  ]);

  const start = useCallback(() => {
    logger.debug(
      `[playback] start() called | isPlaying=${isPlaying} | sections.length=${sections.length}`
    );
    if (isPlaying || sections.length === 0) return;
    cancelledRef.current = false;
    setMessages([]);
    setIsPlaying(true);
    isPlayingRef.current = true;
    sectionIdxRef.current = 0;
    segmentIdxRef.current = 0;
    processNext();
  }, [isPlaying, sections.length, processNext]);

  const skipToEnd = useCallback(() => {
    logger.debug("[playback] skipToEnd called");
    cancelledRef.current = true;
    stopSpeech();
    if (delayRef.current) clearTimeout(delayRef.current);
    setMessages(buildMessages());
    setIsPlaying(false);
    isPlayingRef.current = false;
    onAnimationChange("Idle");
    onStatusChange("idle");
    onComplete();
  }, [
    buildMessages,
    stopSpeech,
    onAnimationChange,
    onStatusChange,
    onComplete,
  ]);

  const stop = useCallback(() => {
    logger.debug("[playback] stop called");
    cancelledRef.current = true;
    stopSpeech();
    if (delayRef.current) clearTimeout(delayRef.current);
    setIsPlaying(false);
    isPlayingRef.current = false;
    onAnimationChange("Idle");
    onStatusChange("idle");
  }, [stopSpeech, onAnimationChange, onStatusChange]);

  const pause = useCallback(() => {
    pauseSpeech();
    onStatusChange("paused");
  }, [pauseSpeech, onStatusChange]);

  const resume = useCallback(() => {
    resumeSpeech();
    onStatusChange("speaking");
  }, [resumeSpeech, onStatusChange]);

  return {
    messages,
    isPlaying,
    isSpeaking,
    start,
    skipToEnd,
    pause,
    resume,
    stop,
  };
};

export default useLessonPlayback;
