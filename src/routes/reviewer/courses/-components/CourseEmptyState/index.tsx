import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import "./style.scss";

const CourseEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="course-empty-state">
      <Icon name="menu_book" size={48} />
      <p>{t("courses.select_course_to_review")}</p>
    </div>
  );
};

export default CourseEmptyState;
