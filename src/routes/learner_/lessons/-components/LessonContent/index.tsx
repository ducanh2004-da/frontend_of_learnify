import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { SectionResponse } from "@/hooks/useLesson";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import "./style.scss";

type TLessonContentProps = {
  lessonName?: string;
  abstract?: string | null;
  sections?: SectionResponse[];
  isLoading?: boolean;
  className?: string;
};

const LessonContent = ({
  lessonName,
  abstract,
  sections = [],
  isLoading = false,
  className,
}: TLessonContentProps) => {
  const { t } = useTranslation();

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [sections]);

  if (isLoading) {
    return (
      <div
        className={classnames(
          "lesson-content",
          "lesson-content--loading",
          className
        )}
      >
        <div className="lesson-content__skeleton-header" />
        <div className="lesson-content__skeleton-line" />
        <div className="lesson-content__skeleton-line" />
        <div className="lesson-content__skeleton-box" />
      </div>
    );
  }

  return (
    <article
      className={classnames("lesson-content", className)}
      data-lenis-prevent
    >
      <header className="lesson-content__header">
        <h1 className="lesson-content__title">
          {lessonName || t("lesson_welcome.lesson_fallback", "Lesson Content")}
        </h1>
        {abstract && <p className="lesson-content__abstract">{abstract}</p>}
        {sortedSections.length > 0 && (
          <div className="lesson-content__meta">
            <span className="lesson-content__meta-badge">
              {t("lesson_welcome.sections_to_cover", {
                count: sortedSections.length,
              })}
            </span>
          </div>
        )}
      </header>

      {sortedSections.length === 0 ? (
        <div className="lesson-content__empty">
          <p>
            {t(
              "lesson_welcome.no_sections",
              "No sections available for this lesson."
            )}
          </p>
        </div>
      ) : (
        <div className="lesson-content__sections">
          {sortedSections.map((section, index) => {
            const sectionNumber =
              section.order != null ? section.order + 1 : index + 1;
            return (
              <section
                key={section.id || `section-${index}`}
                id={`lesson-section-${sectionNumber}`}
                className="lesson-section"
              >
                <div className="lesson-section__divider">
                  <span className="lesson-section__badge">
                    {`Section ${sectionNumber}`}
                  </span>
                  <div className="lesson-section__line" />
                </div>

                {section.urlPdf && (
                  <div className="lesson-section__image-container">
                    <img
                      src={section.urlPdf}
                      alt={`Visual diagram for section ${sectionNumber}`}
                      className="lesson-section__image"
                      loading="lazy"
                    />
                  </div>
                )}

                {section.content && (
                  <div className="lesson-section__markdown">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </article>
  );
};

export default LessonContent;
