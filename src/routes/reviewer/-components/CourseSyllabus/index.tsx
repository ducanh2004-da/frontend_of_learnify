import { useState } from "react";
import TextButton from "@/components/TextButton";
import type { MockLesson } from "@/mock/reviewer-courses";
import "./style.scss";

type TLessonSyllabusProps = {
  lessons: MockLesson[];
};

const LessonSyllabus = ({ lessons }: TLessonSyllabusProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = [...lessons].sort((a, b) => a.order - b.order);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="lesson-syllabus">
      <h2 className="lesson-syllabus__title">
        Course Syllabus
        <span className="lesson-syllabus__count">{sorted.length} lessons</span>
      </h2>

      <ol className="lesson-syllabus__list">
        {sorted.map((lesson) => {
          const isOpen = openId === lesson.id;

          return (
            <li key={lesson.id} className="lesson-syllabus__item">
              <div
                className={`lesson-syllabus__trigger${isOpen ? " lesson-syllabus__trigger--open" : ""}`}
                id={`lesson-trigger-${lesson.id}`}
                aria-expanded={isOpen}
                aria-controls={`lesson-body-${lesson.id}`}
              >
                <TextButton
                  type="secondary"
                  roundedCorner="roundedSquare"
                  size="small"
                  leftIcon={false}
                  rightIcon
                  buttonType="button"
                  icon={isOpen ? "expand_less" : "expand_more"}
                  text={`${String(lesson.order).padStart(2, "0")} ${lesson.lessonName}`}
                  onClick={() => toggle(lesson.id)}
                />
              </div>

              <div
                id={`lesson-body-${lesson.id}`}
                role="region"
                aria-labelledby={`lesson-trigger-${lesson.id}`}
                className={`lesson-syllabus__body${isOpen ? " lesson-syllabus__body--open" : ""}`}
              >
                <p className="lesson-syllabus__abstract">{lesson.abstract}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LessonSyllabus;
