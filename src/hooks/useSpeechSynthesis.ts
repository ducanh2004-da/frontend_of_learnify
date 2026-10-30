import { useCallback } from "react";
import type {
  TSpeechSynthesisOptions,
  TSpeechSynthesisReturn,
} from "@/types/speech.d";

const useSpeechSynthesis = (): TSpeechSynthesisReturn => {
  const speak = useCallback(
    async (
      _text: string,
      _options?: TSpeechSynthesisOptions
    ): Promise<HTMLAudioElement | null> => {
      return null;
    },
    []
  );

  const prefetch = useCallback(
    (_text: string, _options?: TSpeechSynthesisOptions) => {},
    []
  );

  const stop = useCallback(() => {}, []);
  const pause = useCallback(() => {}, []);
  const resume = useCallback(() => {}, []);

  return {
    speak,
    prefetch,
    stop,
    pause,
    resume,
    isSpeaking: false,
    isPaused: false,
    isSupported: false,
  };
};

export default useSpeechSynthesis;
