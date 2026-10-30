import { useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { prepareWithSegments, walkLineRanges } from "@chenglou/pretext";

type TInputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface IUseChatHeaderProps {
  placeholder?: string;
  initialValue?: string;
  onUpdate?: (value: string) => void;
}

interface IUseChatHeaderReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (e: TInputChangeEvent) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useChatHeader = (
  props: IUseChatHeaderProps
): IUseChatHeaderReturn => {
  const { t } = useTranslation();
  const {
    placeholder = t("chat_header.new_conversation"),
    initialValue = "",
    onUpdate,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const computeWidth = useCallback(
    (value: string) => {
      if (!inputRef.current || !wrapperRef.current) return;
      const input = inputRef.current;
      const text = value || placeholder;
      const font = "500 25px Google Sans Flex, sans-serif";

      const iconWidth = 25;
      const gap = 20;
      const dropdownWidth = 32;
      const padding = 10;
      const availableWidth =
        wrapperRef.current.clientWidth -
        iconWidth -
        gap -
        dropdownWidth -
        padding;
      const maxWidth = Math.max(availableWidth, 100);

      const prepared = prepareWithSegments(text, font, {
        whiteSpace: "pre-wrap",
      });
      let maxW = 0;
      walkLineRanges(prepared, maxWidth, (line) => {
        if (line.width > maxW) maxW = line.width;
      });
      input.style.width = `${Math.ceil(maxW) + 2}px`;
    },
    [placeholder]
  );

  const handleInputChange = useCallback(
    (e: TInputChangeEvent) => {
      computeWidth(e.target.value);
    },
    [computeWidth]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputRef.current && onUpdate) {
        onUpdate(inputRef.current.value);
      }
    },
    [onUpdate]
  );

  useLayoutEffect(() => {
    if (inputRef.current && initialValue) {
      inputRef.current.value = initialValue;
    }
    computeWidth(initialValue);
  }, [computeWidth, initialValue]);

  useEffect(() => {
    const handleResize = () =>
      computeWidth(inputRef.current?.value || initialValue);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeWidth, initialValue]);

  return {
    inputRef,
    wrapperRef,
    handleInputChange,
    handleSubmit,
  };
};

export default useChatHeader;
