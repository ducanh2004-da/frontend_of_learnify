import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import "./style.scss";

type TLessonDetailProps = {
  id: string;
  lessonName: string;
  abstract: string;
  createdAt: string;
};

const LessonDetail = ({
  id,
  lessonName,
  abstract,
  createdAt,
}: TLessonDetailProps) => {
  const { t } = useTranslation();

  return (
    <div className="lesson-detail">
      <div className="lesson-detail__header">
        <h4 className="semibold">{lessonName}</h4>
      </div>
      <div className="lesson-detail__body">
        <div className="lesson-detail__section">
          <span className="lesson-detail__section-label">
            {t("courses.description")}
          </span>
          <p className="lesson-detail__section-content">{abstract}</p>
        </div>
      </div>
      <div className="lesson-detail__meta">
        <div className="lesson-detail__meta-item">
          <Icon name="calendar_today" size={14} />
          <span>
            {t("courses.created")}: {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="lesson-detail__meta-item">
          <Icon name="key" size={14} />
          <span>ID: {id}</span>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
