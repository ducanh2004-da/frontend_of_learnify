import classnames from "classnames";
import Icon from "@/components/Icon";
import type { TBackendCourse } from "@/hooks/useCourses";
import "./course-item.scss";

type TCourseItemProps = {
  course: TBackendCourse;
  isActive: boolean;
  statusLabel: string;
  onClick: () => void;
};

const STATUS_CLASS: Record<string, string> = {
  Pending: "Pending",
  Published: "Published",
  Rejected: "Rejected",
};

const CourseItem = (props: TCourseItemProps) => {
  const { course, isActive, statusLabel, onClick } = props;

  return (
    <div
      className={classnames("course-item", { "course-item--active": isActive })}
      onClick={onClick}
    >
      <Icon name="menu_book" className="course-item__icon" size={20} />
      <div className="course-item__info">
        <span className="course-item__name">{course.courseName}</span>
        <span
          className={classnames(
            "course-item__status",
            `course-item__status--${STATUS_CLASS[course.status] ?? course.status.toLowerCase()}`
          )}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
};

export default CourseItem;
