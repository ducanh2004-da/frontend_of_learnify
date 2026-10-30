import { useState, useCallback } from "react";

export type TLessonState = "initial" | "lesson" | "qa" | "quiz" | "complete";

const useLessonFlow = () => {
  const [state, setState] = useState<TLessonState>("initial");

  const startLesson = useCallback(() => {
    setState("lesson");
  }, []);

  const skipToQA = useCallback(() => {
    setState((prev) => (prev === "lesson" ? "qa" : prev));
  }, []);

  const skipToQuiz = useCallback(() => {
    setState((prev) => (prev === "qa" ? "quiz" : prev));
  }, []);

  const completeLesson = useCallback(() => {
    setState((prev) => (prev === "quiz" ? "complete" : prev));
  }, []);

  const reset = useCallback(() => {
    setState("initial");
  }, []);

  return {
    state,
    startLesson,
    skipToQA,
    skipToQuiz,
    completeLesson,
    reset,
  };
};

export default useLessonFlow;
