import type { MockCourseDetail } from "@/mock/reviewer-courses";
import CourseDetailHeader from "@reviewer/-components/CourseDetailHeader";
import LessonSyllabus from "@reviewer/-components/CourseSyllabus";
import ReviewActionPanel from "@reviewer/-components/ReviewActionPanel";
import "./style.scss";

type TCourseDetailViewProps = {
  course: MockCourseDetail;
  onApprove: () => void;
  onReject: () => void;
  isPublishing?: boolean;
  isRejecting?: boolean;
};

const CourseDetailView = (props: TCourseDetailViewProps) => {
  const { course, onApprove, onReject, isPublishing, isRejecting } = props;

  return (
    <div className="course-detail-view">
      <div className="course-detail-view__content">
        <CourseDetailHeader course={course} />
        <LessonSyllabus lessons={course.lessons} />
      </div>
      <ReviewActionPanel
        status={course.status}
        onApprove={onApprove}
        onReject={onReject}
        isPublishing={isPublishing}
        isRejecting={isRejecting}
      />
    </div>
  );
};

export default CourseDetailView;
