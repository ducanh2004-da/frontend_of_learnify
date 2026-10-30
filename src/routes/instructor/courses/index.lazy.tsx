import { createLazyFileRoute } from "@tanstack/react-router";
import classnames from "classnames";

import { useManageCourses, tStatus } from "./-hooks/useManageCourses";

import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";
import SplitPanel from "@/components/SplitPanel";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import LessonDetail from "./-components/LessonDetail";

import "./style.scss";

export const Route = createLazyFileRoute("/instructor/courses/")({
  component: ManageCoursesPage,
});

function ManageCoursesPage() {
  const {
    t,
    STATUSES,
    filteredCourses,
    isLoading,
    isCourseLoading,
    isCreatingCourse,
    isDeletingCourse,
    isCreatingLesson,
    isDeletingLesson,
    statusFilter,
    setStatusFilter,
    selectedCourseId,
    setSelectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    lessons,
    selectedLesson,
    showAddCourse,
    courseName,
    setCourseName,
    courseDescription,
    setCourseDescription,
    coursePriceStr,
    setCoursePriceStr,
    errors,
    setErrors,
    courseToDelete,
    showAddLesson,
    lessonTitle,
    setLessonTitle,
    lessonDescription,
    setLessonDescription,
    lessonFiles,
    lessonErrors,
    setLessonErrors,
    lessonToDelete,
    fileInputRef,
    handleAddCourse,
    handleFileChange,
    removeFile,
    isDragging,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleAddLesson,
    handleDeleteCourse,
    handleDeleteLesson,
    openAddCourse,
    closeAddCourse,
    openDeleteCourse,
    closeDeleteCourse,
    openAddLesson,
    closeAddLesson,
    openDeleteLesson,
    closeDeleteLesson,
  } = useManageCourses();

  return (
    <div className="manage-courses">
      <Modal
        open={showAddCourse}
        onClose={closeAddCourse}
        title={t("sidebar.add_course")}
      >
        <div className="manage-courses__form">
          <label className="manage-courses__form-label">
            {t("courses.name")}
            <input
              className={classnames("manage-courses__form-input", {
                "manage-courses__form-input--error": errors.courseName,
              })}
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                if (errors.courseName)
                  setErrors((p) => ({ ...p, courseName: "" }));
              }}
              placeholder={t("courses.name_placeholder")}
            />
            {errors.courseName && (
              <span className="manage-courses__form-error">
                {errors.courseName}
              </span>
            )}
          </label>
          <label className="manage-courses__form-label">
            {t("courses.description")}
            <textarea
              className={classnames("manage-courses__form-textarea", {
                "manage-courses__form-textarea--error": errors.abstract,
              })}
              value={courseDescription}
              onChange={(e) => {
                setCourseDescription(e.target.value);
                if (errors.abstract) setErrors((p) => ({ ...p, abstract: "" }));
              }}
              placeholder={t("courses.description_placeholder")}
            />
            {errors.abstract && (
              <span className="manage-courses__form-error">
                {errors.abstract}
              </span>
            )}
          </label>
          <label className="manage-courses__form-label">
            {t("courses.price")}
            <div className="manage-courses__price-wrapper">
              <span className="manage-courses__price-currency">₫</span>
              <input
                type="text"
                inputMode="numeric"
                className="manage-courses__form-input"
                value={coursePriceStr}
                onFocus={() => {
                  if (coursePriceStr === "0") setCoursePriceStr("");
                }}
                onBlur={() => {
                  if (coursePriceStr === "") setCoursePriceStr("0");
                }}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw === "") {
                    setCoursePriceStr("");
                  } else {
                    setCoursePriceStr(raw.replace(/^0+/, "") || "0");
                  }
                }}
              />
            </div>
            {coursePriceStr === "0" && (
              <span className="manage-courses__form-hint">
                {t("courses.free_hint")}
              </span>
            )}
          </label>
          <div className="manage-courses__form-actions">
            <TextButton
              text={t("common.cancel")}
              onClick={closeAddCourse}
              size="medium"
              type="secondary"
            />
            <TextButton
              text={
                isCreatingCourse ? t("common.creating") : t("common.create")
              }
              onClick={handleAddCourse}
              disabled={isCreatingCourse}
              loading={isCreatingCourse}
              size="medium"
              type="primary"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!courseToDelete}
        onClose={closeDeleteCourse}
        title={t("courses.delete_title")}
      >
        <div className="manage-courses__confirm">
          <p>{t("courses.delete_confirm")}</p>
          <div className="manage-courses__form-actions">
            <TextButton
              text={t("common.cancel")}
              onClick={closeDeleteCourse}
              size="medium"
              type="secondary"
            />
            <TextButton
              text={
                isDeletingCourse ? t("common.deleting") : t("common.delete")
              }
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
              loading={isDeletingCourse}
              size="medium"
              type="primary"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={showAddLesson}
        onClose={closeAddLesson}
        title={t("sidebar.add_lesson")}
      >
        <div className="manage-courses__form">
          <label className="manage-courses__form-label">
            {t("courses.lesson_title")}
            <input
              className={classnames("manage-courses__form-input", {
                "manage-courses__form-input--error": lessonErrors.lessonTitle,
              })}
              value={lessonTitle}
              onChange={(e) => {
                setLessonTitle(e.target.value);
                if (lessonErrors.lessonTitle)
                  setLessonErrors((p) => ({ ...p, lessonTitle: "" }));
              }}
              placeholder={t("courses.lesson_title_placeholder")}
            />
            {lessonErrors.lessonTitle && (
              <span className="manage-courses__form-error">
                {lessonErrors.lessonTitle}
              </span>
            )}
          </label>
          <label className="manage-courses__form-label">
            {t("courses.lesson_description")}
            <textarea
              className={classnames("manage-courses__form-textarea", {
                "manage-courses__form-textarea--error":
                  lessonErrors.lessonDescription,
              })}
              value={lessonDescription}
              onChange={(e) => {
                setLessonDescription(e.target.value);
                if (lessonErrors.lessonDescription)
                  setLessonErrors((p) => ({ ...p, lessonDescription: "" }));
              }}
              placeholder={t("courses.lesson_desc_placeholder")}
            />
            {lessonErrors.lessonDescription && (
              <span className="manage-courses__form-error">
                {lessonErrors.lessonDescription}
              </span>
            )}
          </label>

          <div className="manage-courses__form-label">
            <span>{t("courses.files")}</span>
            <div
              className={classnames("manage-courses__file-zone", {
                "manage-courses__file-zone--error": lessonErrors.files,
                "manage-courses__file-zone--dragging": isDragging,
              })}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icon name="attach_file" size={24} />
              <span>{t("courses.files_click")}</span>
              <span className="manage-courses__file-hint">
                {t("courses.files_hint", {
                  maxFiles: 10,
                  maxSize: "50MB",
                })}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.ppt,.pptx"
              multiple
              className="manage-courses__file-hidden"
              onChange={handleFileChange}
            />
            {lessonErrors.files && (
              <span className="manage-courses__form-error">
                {lessonErrors.files}
              </span>
            )}
            {lessonFiles.length > 0 && (
              <div className="manage-courses__file-list">
                {lessonFiles.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="manage-courses__file-item"
                  >
                    <Icon name="description" size={16} />
                    <span className="manage-courses__file-name">
                      {file.name}
                    </span>
                    <span className="manage-courses__file-size">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <TextButton
                      icon="close"
                      text=""
                      onClick={() => removeFile(i)}
                      size="tiny"
                      type="secondary"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="manage-courses__form-actions">
            <TextButton
              text={t("common.cancel")}
              onClick={closeAddLesson}
              disabled={isCreatingLesson}
              size="medium"
              type="secondary"
            />
            <TextButton
              text={
                isCreatingLesson ? t("common.creating") : t("common.create")
              }
              onClick={handleAddLesson}
              disabled={isCreatingLesson}
              loading={isCreatingLesson}
              size="medium"
              type="primary"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!lessonToDelete}
        onClose={closeDeleteLesson}
        title={t("courses.delete_lesson_title")}
      >
        <div className="manage-courses__confirm">
          <p>{t("courses.delete_lesson_confirm")}</p>
          <div className="manage-courses__form-actions">
            <TextButton
              text={t("common.cancel")}
              onClick={closeDeleteLesson}
              disabled={isDeletingLesson}
              size="medium"
              type="secondary"
            />
            <TextButton
              text={
                isDeletingLesson ? t("common.deleting") : t("common.delete")
              }
              onClick={handleDeleteLesson}
              disabled={isDeletingLesson}
              loading={isDeletingLesson}
              size="medium"
              type="primary"
            />
          </div>
        </div>
      </Modal>

      <SplitPanel>
        <SplitPanel.Tabs>
          {STATUSES.map((s) => (
            <SplitPanel.Tab
              key={s}
              active={statusFilter === s}
              onClick={() => {
                setStatusFilter(s);
                setSelectedCourseId(null);
                setSelectedLessonId(null);
              }}
            >
              {tStatus(t, s)}
            </SplitPanel.Tab>
          ))}
        </SplitPanel.Tabs>

        <SplitPanel.Content>
          <SplitPanel.List>
            {isLoading && filteredCourses.length === 0 ? (
              <TetrisLoader size="md" speed="fast" />
            ) : (
              <>
                <TextButton
                  icon="add"
                  text={t("sidebar.add_course")}
                  onClick={openAddCourse}
                  size="small"
                />
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={classnames("manage-courses__item", {
                      "manage-courses__item--active":
                        selectedCourseId === course.id,
                    })}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedLessonId(null);
                    }}
                  >
                    <Icon
                      name="menu_book"
                      className="manage-courses__item-icon"
                      size={20}
                    />
                    <div className="manage-courses__item-info">
                      <span className="manage-courses__item-name">
                        {course.courseName}
                      </span>
                      <span
                        className={`manage-courses__item-status manage-courses__item-status--${course.status.toLowerCase()}`}
                      >
                        {tStatus(t, course.status)}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        icon="delete"
                        size="small"
                        type="secondary"
                        onClick={() => openDeleteCourse(course.id)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </SplitPanel.List>

          <SplitPanel.SubList>
            {!selectedCourseId ? (
              <div className="split-panel__placeholder">
                <p>{t("courses.select_course")}</p>
              </div>
            ) : isCourseLoading ? (
              <TetrisLoader size="md" speed="fast" />
            ) : (
              <>
                <TextButton
                  icon="add"
                  text={t("sidebar.add_lesson")}
                  onClick={openAddLesson}
                  size="small"
                />
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={classnames("manage-courses__lesson-item", {
                        "manage-courses__lesson-item--active":
                          selectedLessonId === lesson.id,
                      })}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <Icon
                        name="play_circle"
                        className="manage-courses__lesson-item-icon"
                      />
                      <div className="manage-courses__lesson-item-info">
                        <span className="manage-courses__lesson-item-name medium">
                          {lesson.lessonName}
                        </span>
                        <small className="manage-courses__lesson-item-date">
                          {new Date(
                            lesson.createdAt as string
                          ).toLocaleDateString()}
                        </small>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          icon="delete"
                          size="small"
                          type="secondary"
                          onClick={() => openDeleteLesson(lesson.id)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="split-panel__empty">
                    {t("courses.no_lessons")}
                  </div>
                )}
              </>
            )}
          </SplitPanel.SubList>

          <SplitPanel.SubDetail>
            {selectedLessonId && isCourseLoading ? (
              <TetrisLoader size="md" speed="fast" />
            ) : selectedLessonId && selectedLesson ? (
              <LessonDetail
                id={selectedLesson.id}
                lessonName={selectedLesson.lessonName}
                abstract={selectedLesson.abstract}
                createdAt={selectedLesson.createdAt}
              />
            ) : (
              <div className="split-panel__placeholder">
                <p>{t("courses.select_lesson")}</p>
              </div>
            )}
          </SplitPanel.SubDetail>
        </SplitPanel.Content>
      </SplitPanel>
    </div>
  );
}
