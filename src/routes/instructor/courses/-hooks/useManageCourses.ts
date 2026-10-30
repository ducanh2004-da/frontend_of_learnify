import { useMemo, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useAuthStore } from "@/store";
import {
  useGetCoursesByUserId,
  useGetCoursesById,
  useCreateCourse,
  useDeleteCourse,
  useCreateLessonFromAi,
  useUploadDocument,
  useDeleteLesson,
  type TBackendCourse,
} from "@/hooks/useCourses";

const COURSE_STATUSES = ["All", "Published", "Pending", "Rejected"] as const;
export type TCourseStatus = (typeof COURSE_STATUSES)[number];

export type TLesson = {
  id: string;
  lessonName: string;
  abstract: string;
  createdAt: string;
};

const courseSchema = z.object({
  courseName: z.string().min(1, "courses.name_required"),
  abstract: z.string().min(1, "courses.description_required"),
});

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 10;

export const COURSE_STATUS_TRANSLATION_KEYS: Record<string, string> = {
  All: "courses.status_all",
  Published: "courses.status_published",
  Pending: "courses.status_pending",
  Rejected: "courses.status_rejected",
};

export const tStatus = (t: (key: string) => string, status: string) =>
  t(COURSE_STATUS_TRANSLATION_KEYS[status] ?? status);

export function useManageCourses() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: courses, isLoading } = useGetCoursesByUserId(user?.id ?? "");
  const { mutate: createCourse, isPending: isCreatingCourse } =
    useCreateCourse();
  const { mutate: deleteCourse, isPending: isDeletingCourse } =
    useDeleteCourse();
  const { mutate: createLesson, isPending: isCreatingLesson } =
    useCreateLessonFromAi();
  const { mutate: deleteLesson, isPending: isDeletingLesson } =
    useDeleteLesson();
  const uploadDoc = useUploadDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusFilter, setStatusFilter] = useState<TCourseStatus>("All");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePriceStr, setCoursePriceStr] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonFiles, setLessonFiles] = useState<File[]>([]);
  const [lessonErrors, setLessonErrors] = useState<Record<string, string>>({});
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: courseData, isLoading: isCourseLoading } = useGetCoursesById(
    selectedCourseId ?? ""
  );

  const filteredCourses: TBackendCourse[] = useMemo(() => {
    if (!courses) return [];
    if (statusFilter === "All") return courses;
    return courses.filter((c) => c.status === statusFilter);
  }, [courses, statusFilter]);

  const lessons: TLesson[] = useMemo(() => {
    if (!courseData?.getLessonsByCourseId?.lessons) return [];
    return courseData.getLessonsByCourseId.lessons;
  }, [courseData]);

  const selectedLesson = useMemo(
    () =>
      selectedLessonId
        ? (lessons.find((l) => l.id === selectedLessonId) ?? null)
        : null,
    [selectedLessonId, lessons]
  );

  const validateFiles = useCallback(
    (files: File[]): string | null => {
      if (files.length > MAX_FILES) {
        return t("courses.files_max_count", { count: MAX_FILES });
      }
      for (const file of files) {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          return t("courses.files_type_error");
        }
        if (file.size > MAX_FILE_SIZE) {
          return t("courses.files_size_error", {
            name: file.name,
            size: "50MB",
          });
        }
      }
      return null;
    },
    [t]
  );

  const resetAddCourse = useCallback(() => {
    setShowAddCourse(false);
    setCourseName("");
    setCourseDescription("");
    setCoursePriceStr("0");
    setErrors({});
  }, []);

  const handleAddCourse = useCallback(() => {
    const result = courseSchema.safeParse({
      courseName: courseName.trim(),
      abstract: courseDescription.trim(),
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        fieldErrors[field] = t(issue.message);
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const coursePrice = coursePriceStr
      ? Math.max(0, parseInt(coursePriceStr, 10))
      : 0;
    createCourse(
      {
        courseName: result.data.courseName,
        abstract: result.data.abstract,
        creatorId: user?.id,
        isFree: coursePrice === 0,
        originalPrice: coursePrice,
      },
      { onSuccess: resetAddCourse }
    );
  }, [
    courseName,
    courseDescription,
    coursePriceStr,
    user?.id,
    t,
    createCourse,
    resetAddCourse,
  ]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      setLessonFiles((prev) => {
        const combined = [...prev, ...files];
        const err = validateFiles(combined);
        if (err) {
          setLessonErrors((p) => ({ ...p, files: err }));
          return prev;
        }
        setLessonErrors((p) => {
          const next = { ...p };
          delete next.files;
          return next;
        });
        return combined;
      });
      e.target.value = "";
    },
    [validateFiles]
  );

  const removeFile = useCallback((index: number) => {
    setLessonFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      setLessonFiles((prev) => {
        const combined = [...prev, ...incoming];
        const err = validateFiles(combined);
        if (err) {
          setLessonErrors((p) => ({ ...p, files: err }));
          return prev;
        }
        setLessonErrors((p) => {
          const next = { ...p };
          delete next.files;
          return next;
        });
        return combined;
      });
    },
    [validateFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const resetAddLesson = useCallback(() => {
    setShowAddLesson(false);
    setLessonTitle("");
    setLessonDescription("");
    setLessonFiles([]);
    setLessonErrors({});
  }, []);

  const handleAddLesson = useCallback(() => {
    if (!selectedCourseId) return;
    const errs: Record<string, string> = {};
    if (!lessonTitle.trim())
      errs.lessonTitle = t("courses.lesson_title_required");
    if (!lessonDescription.trim())
      errs.lessonDescription = t("courses.lesson_desc_required");
    if (lessonFiles.length === 0) errs.files = t("courses.files_required");
    if (Object.keys(errs).length > 0) {
      setLessonErrors(errs);
      return;
    }
    setLessonErrors({});

    const firstPdf =
      lessonFiles.find((f) => f.type === "application/pdf") ?? lessonFiles[0]!;

    createLesson(
      {
        data: {
          course_id: selectedCourseId,
          lessonName: lessonTitle.trim(),
          abstract: lessonDescription.trim(),
        },
        pdfFile: firstPdf,
      },
      {
        onSuccess: () => {
          const remaining = lessonFiles.filter((f) => f !== firstPdf);
          if (remaining.length > 0 && user?.id) {
            remaining.forEach((f) =>
              uploadDoc.mutate({ file: f, uploadedBy: user.id })
            );
          }
          resetAddLesson();
        },
      }
    );
  }, [
    selectedCourseId,
    lessonTitle,
    lessonDescription,
    lessonFiles,
    user,
    t,
    createLesson,
    uploadDoc,
    resetAddLesson,
  ]);

  const handleDeleteCourse = useCallback(() => {
    if (!courseToDelete) return;
    deleteCourse(courseToDelete, {
      onSuccess: () => setCourseToDelete(null),
    });
  }, [courseToDelete, deleteCourse]);

  const handleDeleteLesson = useCallback(() => {
    if (!lessonToDelete) return;
    deleteLesson(lessonToDelete, {
      onSuccess: () => setLessonToDelete(null),
    });
  }, [lessonToDelete, deleteLesson]);

  const openAddCourse = useCallback(() => setShowAddCourse(true), []);
  const closeAddCourse = resetAddCourse;

  const openDeleteCourse = useCallback(
    (id: string) => setCourseToDelete(id),
    []
  );
  const closeDeleteCourse = useCallback(() => setCourseToDelete(null), []);

  const openAddLesson = useCallback(() => setShowAddLesson(true), []);
  const closeAddLesson = resetAddLesson;

  const openDeleteLesson = useCallback(
    (id: string) => setLessonToDelete(id),
    []
  );
  const closeDeleteLesson = useCallback(() => setLessonToDelete(null), []);

  return {
    t,
    STATUSES: COURSE_STATUSES,
    filteredCourses,
    isLoading,
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
    courseData,
    isCourseLoading,
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
  };
}
