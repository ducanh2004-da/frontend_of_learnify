import type { TBackendCourse } from "@/hooks/useCourses";
import "./style.scss";

type TCourseDetailProps = {
  course: TBackendCourse;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CourseDetail = ({ course }: TCourseDetailProps) => {
  return (
    <div className="course-detail">
      <h3 className="course-detail__title semibold">{course.courseName}</h3>
      <span
        className={`course-detail__status course-detail__status--${course.status.toLowerCase()}`}
      >
        {course.status}
      </span>

      <p className="course-detail__abstract regular">{course.abstract}</p>

      <div className="course-detail__meta">
        <div className="course-detail__meta-item">
          <span className="course-detail__meta-label">Created</span>
          <span className="course-detail__meta-value">
            {formatDate(course.createdAt)}
          </span>
        </div>
        <div className="course-detail__meta-item">
          <span className="course-detail__meta-label">Updated</span>
          <span className="course-detail__meta-value">
            {formatDate(course.updatedAt)}
          </span>
        </div>
      </div>

      {course.keyLearnings && course.keyLearnings.length > 0 && (
        <div className="course-detail__learnings">
          <h5 className="semibold">Key Learnings</h5>
          <ul>
            {course.keyLearnings.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
