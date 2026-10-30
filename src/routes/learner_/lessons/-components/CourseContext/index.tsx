import "./course-context.scss";

import IconButton from "@/components/IconButton";
import {
  MOCK_DOCUMENTS,
  MOCK_NOTES,
  MOCK_REFERENCES,
} from "@/mock/course-context";
import { COLORS } from "@/styles/colors";
import { logger } from "@/utils/logger";
import classnames from "classnames";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownMenu from "../DropdownMenu";
import type { TCourseContextProps, TCourseContextRef } from "./type";

const CourseContext = forwardRef<TCourseContextRef, TCourseContextProps>(
  (props, ref) => {
    const { t } = useTranslation();
    const {
      references = MOCK_REFERENCES,
      documents = MOCK_DOCUMENTS,
      notes = MOCK_NOTES,
    } = props;

    logger.info("[CourseContext] props:", { references, documents, notes });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isContextOpen, setIsContextOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          setOpenDropdown(null);
          setIsContextOpen(false);
        },
      }),
      []
    );

    const handleToggle = (title: string, isOpen: boolean) => {
      setOpenDropdown(isOpen ? title : null);
    };

    return (
      <>
        <IconButton
          icon="quick_reference"
          onClick={() => setIsContextOpen(!isContextOpen)}
          size="medium"
          shape="circle"
          type="custom"
          color={COLORS.neutral900}
          backgroundColor={COLORS.greenPastel100}
          className="course-context_toggle"
          tooltip={t("course_context.toggle")}
          data-lenis-prevent
        />
        <div
          className={classnames("course-context", {
            open: isContextOpen,
          })}
          data-lenis-prevent
        >
          <div className="course-context_header">
            <h4 className="semibold">{t("course_context.title")}</h4>
            <IconButton
              icon="close"
              onClick={() => setIsContextOpen(false)}
              size="tiny"
              shape="circle"
              type="custom"
              color={COLORS.neutral900}
              tooltip={t("course_context.close")}
            />
          </div>
          <DropdownMenu
            icon="quick_reference"
            title={t("course_context.references")}
            iconOption="description"
            buttonBackgroundColor={COLORS.greenPastel100}
            isOpen={openDropdown === "References"}
            onToggle={(isOpen) => handleToggle("References", isOpen)}
            options={references}
          />
          <DropdownMenu
            icon="docs"
            title={t("course_context.documents")}
            iconOption="docs"
            buttonBackgroundColor={COLORS.navyPastel100}
            isOpen={openDropdown === "Documents"}
            onToggle={(isOpen) => handleToggle("Documents", isOpen)}
            options={documents}
          />
          <DropdownMenu
            icon="note_stack"
            title={t("course_context.notes")}
            iconOption="sticky_note_2"
            buttonBackgroundColor={COLORS.yellow300}
            isOpen={openDropdown === "Notes"}
            onToggle={(isOpen) => handleToggle("Notes", isOpen)}
            options={notes}
          />
        </div>
      </>
    );
  }
);

CourseContext.displayName = "CourseContext";

export default CourseContext;
