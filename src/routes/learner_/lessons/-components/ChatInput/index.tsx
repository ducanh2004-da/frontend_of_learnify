import { memo, useRef, useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import IconButton from "@/components/IconButton";
import type { TChatInputProps } from "./type";

import "./style.scss";

const MIN_HEIGHT = 20;
const MAX_HEIGHT = 200;

const ChatInput = (props: TChatInputProps) => {
  const { t } = useTranslation();
  const {
    onSendMessage,
    onAttachFile,
    onVoiceInput,
    disabled = false,
    placeholder = t("chat_input.placeholder"),
    className,
  } = props;

  const [message, setMessage] = useState("");
  const valueRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    const value = valueRef.current;
    if (value.trim() && !disabled) {
      onSendMessage(value.trim());
      valueRef.current = "";
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    }
  }, [disabled, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const cls = classnames("chat-input", className);

  return (
    <div className={cls}>
      <IconButton
        className={classnames("chat-input-action", { disabled: !onAttachFile })}
        onClick={onAttachFile}
        disabled={!onAttachFile}
        aria-label={t("chat_input.attach_file")}
        icon="attach_file"
        type="secondary"
        size="tiny"
        tooltip={t("chat_input.attach_file_tooltip")}
      />
      <textarea
        ref={textareaRef}
        className="chat-input-field"
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          valueRef.current = e.target.value;
          setMessage(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        aria-label={t("chat_input.message_input")}
        rows={1}
      />
      <IconButton
        className={classnames("chat-input-action", { disabled: !onVoiceInput })}
        onClick={onVoiceInput}
        aria-label={t("chat_input.voice_input")}
        icon="mic"
        type="secondary"
        size="tiny"
        tooltip={t("chat_input.voice_input_tooltip")}
        disabled={!onVoiceInput}
      />
      <IconButton
        className={classnames("chat-input-send", {
          disabled: !message.trim() || disabled,
        })}
        size="tiny"
        type="secondary"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        aria-label={t("chat_input.send_message")}
        icon="send"
        tooltip={t("chat_input.send_message_tooltip")}
        buttonType="submit"
      />
    </div>
  );
};

export default memo(ChatInput);
