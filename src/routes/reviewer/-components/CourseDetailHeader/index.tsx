import { useTranslation } from "react-i18next";
import TextButton from "@/components/TextButton";
import Icon from "@/components/Icon";
import type { MockCourseDetail, TReviewStatus } from "@/mock/reviewer-courses";
import type { TTypeSecondary } from "@/types/global";
import "./style.scss";

type TCourseDetailHeaderProps = {
  course: MockCourseDetail;
};

const STATUS_COLOR: Record<TReviewStatus, TTypeSecondary> = {
  Pending: "pastelYellow",
  Rejected: "pastelSalmon",
  Published: "pastelGreen",
};

const CourseDetailHeader = ({ course }: TCourseDetailHeaderProps) => {
  const { t } = useTranslation();
  const { title, creatorName, dateSubmitted, status, abstract, keyLearnings } =
    course;

  return (
    <div className="course-detail-header">
      <div className="course-detail-header__top">
        <div className="course-detail-header__meta">
          <h2 className="course-detail-header__title">{title}</h2>
          <div className="course-detail-header__byline">
            <span className="course-detail-header__creator">
              {t("reviewer.by_creator", { name: creatorName })}
            </span>
            <span className="course-detail-header__separator" aria-hidden>
              ·
            </span>
            <span className="course-detail-header__date">
              {t("reviewer.submitted", { date: dateSubmitted })}
            </span>
          </div>
        </div>

        <TextButton
          type="secondary"
          typeSecondary={STATUS_COLOR[status]}
          size="tiny"
          roundedCorner="rounded"
          leftIcon={false}
          rightIcon={false}
          text={status}
          onClick={() => {}}
        />
      </div>

      <p className="course-detail-header__abstract">{abstract}</p>

      <div className="course-detail-header__learnings">
        <h2 className="course-detail-header__learnings-title">
          {t("reviewer.what_students_learn")}
        </h2>
        <ul className="course-detail-header__learnings-list">
          {keyLearnings.map((point) => (
            <li key={point} className="course-detail-header__learning-item">
              <Icon name="check" size={16} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
