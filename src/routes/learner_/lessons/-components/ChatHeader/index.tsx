import classnames from "classnames";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import { COLORS } from "@/styles/colors";
import { useChatHeader } from "./-hooks/useChatHeader";
import type { TChatHeaderProps } from "./type";

import "./style.scss";

const ChatHeader = (props: TChatHeaderProps) => {
  const { t } = useTranslation();
  const {
    className,
    initialValue,
    onUpdate,
    onSkipLesson,
    onSkipQA,
    onSkipQuiz,
    onFlag,
    flagged,
    state,
  } = props;
  const { inputRef, wrapperRef, handleInputChange, handleSubmit } =
    useChatHeader({
      placeholder: t("chat_header.new_conversation"),
      initialValue,
      onUpdate,
    });

  const cls = classnames("chat-header", className);

  return (
    <form className={cls} onSubmit={handleSubmit}>
      <div className="chat-header-context" ref={wrapperRef}>
        <Icon name="chat" style={{ pointerEvents: "none" }} size="25px" />
        <div>
          <input
            id="chat-header-input"
            ref={inputRef}
            className="chat-header-context-title medium"
            placeholder={t("chat_header.new_conversation")}
            onChange={handleInputChange}
          />
          <IconButton
            icon="arrow_drop_down"
            type="secondary"
            size="tiny"
            tooltip={t("chat_header.change_topic")}
            className="chat-header-context-dropdown"
          />
        </div>
      </div>
      <div className="chat-header-actions">
        {state && state !== "initial" && state !== "complete" && (
          <>
            {state === "lesson" && (
              <IconButton
                icon="last_page"
                onClick={onSkipLesson}
                size="tiny"
                color={COLORS.white}
                backgroundColor={COLORS.accentLilacVodka}
                tooltip={t("chat_header.skip_qa")}
              />
            )}
            {state === "qa" && (
              <IconButton
                icon="keyboard_double_arrow_right"
                onClick={onSkipQA}
                size="tiny"
                color={COLORS.white}
                backgroundColor={COLORS.accentBlueCeleste}
                tooltip={t("chat_header.skip_quiz")}
              />
            )}
            {state === "quiz" && (
              <IconButton
                icon="stat_3"
                onClick={onSkipQuiz}
                size="tiny"
                color={COLORS.white}
                backgroundColor={COLORS.accentPortage}
                tooltip={t("chat_header.complete_lesson")}
              />
            )}
            <IconButton
              icon="flag"
              onClick={onFlag}
              size="tiny"
              disabled={flagged}
              color={flagged ? COLORS.neutral500 : COLORS.white}
              backgroundColor={flagged ? COLORS.neutral200 : COLORS.modeOrange}
              tooltip={t("chat_header.report_issue")}
            />
          </>
        )}
      </div>
    </form>
  );
};

export default ChatHeader;
