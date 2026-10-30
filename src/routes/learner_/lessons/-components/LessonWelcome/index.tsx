import "./lesson-welcome.scss";

import TextButton from "@/components/TextButton";
import { useTranslation } from "react-i18next";

type TLessonWelcomeProps = {
  lessonName?: string;
  abstract?: string | null;
  sectionCount?: number;
  onStart: () => void;
};

const LessonWelcome = (props: TLessonWelcomeProps) => {
  const { t } = useTranslation();
  const { lessonName, abstract, sectionCount, onStart } = props;

  return (
    <div className="lesson-welcome">
      <h2 className="lesson-welcome__title">
        {lessonName || t("lesson_welcome.lesson_fallback")}
      </h2>
      {abstract && <p className="lesson-welcome__abstract">{abstract}</p>}
      <p className="lesson-welcome__sections">
        {t("lesson_welcome.sections_to_cover", { count: sectionCount || 0 })}
      </p>
      <TextButton
        text={t("lesson_welcome.start_lesson")}
        onClick={onStart}
        size="medium"
        icon="play"
      />
    </div>
  );
};

export default LessonWelcome;
