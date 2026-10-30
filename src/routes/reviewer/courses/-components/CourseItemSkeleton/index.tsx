import "./style.scss";

const CourseItemSkeleton = () => {
  return (
    <div className="course-item-skeleton">
      <div className="skeleton-shape course-item-skeleton__icon" />
      <div className="course-item-skeleton__info">
        <div className="skeleton-shape course-item-skeleton__name" />
        <div className="skeleton-shape course-item-skeleton__status" />
      </div>
    </div>
  );
};

export default CourseItemSkeleton;
