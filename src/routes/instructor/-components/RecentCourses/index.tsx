import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/components/Icon";
import type { TBackendCourse } from "@/hooks/useCourses";
import { tStatus } from "../../courses/-hooks/useManageCourses";
import "./style.scss";

type TRecentCoursesProps = {
  courses: TBackendCourse[];
};

const RecentCourses = ({ courses }: TRecentCoursesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="recent-courses">
      <h4 className="recent-courses__title semibold">
        {t("dashboard.recent_courses")}
      </h4>
      {courses.length === 0 ? (
        <p className="recent-courses__empty">{t("dashboard.no_courses")}</p>
      ) : (
        <div className="recent-courses__list">
          {courses.map((course) => (
            <button
              key={course.id}
              className="recent-courses__item"
              onClick={() => navigate({ to: "/instructor/courses" })}
            >
              <Icon
                name="menu_book"
                className="recent-courses__item-icon"
                size={20}
              />
              <div className="recent-courses__item-info">
                <span className="recent-courses__item-name">
                  {course.courseName}
                </span>
                <div className="recent-courses__item-meta">
                  <span
                    className={`recent-courses__item-status recent-courses__item-status--${course.status.toLowerCase()}`}
                  >
                    {tStatus(t, course.status)}
                  </span>
                  <span className="recent-courses__item-date">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentCourses;
