import { useState, useRef, useCallback } from "react";
import type { TTeacherAnimation } from "../-components/TeacherAnimation/type";
import type { TTeacherStatus } from "../-components/TeacherStatusIndicator/type";
import type { TChatMessageRef } from "../-components/ChatMessages";

export type TStopFn = () => void;

export type TTeacher = {
  isMuted: boolean;
  chatRef: React.RefObject<TChatMessageRef | null>;
  stopRef: React.MutableRefObject<TStopFn | null>;
  stopChat: () => void;
  setAnimation: (animation: TTeacherAnimation) => void;
  setStatus: (status: TTeacherStatus) => void;
  resetTeacher: () => void;
};

const useTeacher = (): TTeacher => {
  const [, setAnimation] = useState<TTeacherAnimation>("Idle");
  const [, setStatus] = useState<TTeacherStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const chatRef = useRef<TChatMessageRef>(null);
  const stopRef = useRef<TStopFn | null>(null);

  const stopChat = useCallback(() => chatRef.current?.stop(), []);

  const resetTeacher = useCallback(() => {
    stopRef.current?.();
    setAnimation("Idle");
    setStatus("idle");
    setIsMuted(false);
  }, []);

  return {
    isMuted,
    chatRef,
    stopRef,
    stopChat,
    setAnimation,
    setStatus,
    resetTeacher,
  };
};

export default useTeacher;
