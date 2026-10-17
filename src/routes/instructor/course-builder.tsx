import "./course-builder.scss";

import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { getCurrentUserFn } from "@/server/auth";
import { normalizeRole } from "@/utils/role";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { graphqlClient, GRAPHQL_ENDPOINT, fetchCsrfToken } from "@/lib/graphql";
import { CREATE_COURSE_MUTATION } from "@/graphql/course";
import Icon from "@/components/Icon";
import { useAuthStore } from "@/store";

export const Route = createFileRoute("/instructor/course-builder")({
  beforeLoad: async () => {
    const { user, expired } = await getCurrentUserFn();
    if (expired && typeof window !== "undefined") {
      toast.error("Session expired. Please log in again.");
    }
    if (!user) {
      throw redirect({ to: "/auth/log-in" });
    }
    const role = normalizeRole(user.role);
    if (role !== "instructor" && role !== "admin") {
      throw redirect({ to: "/" });
    }
    return { user };
  },
  head: () => ({
    meta: [
      { title: "AI Course Builder | Instructor - Learnify" },
      {
        name: "description",
        content:
          "Build comprehensive courses and generate AI lessons from PDF documents",
      },
    ],
  }),
  component: CourseBuilderPage,
});

interface CreatedCourseData {
  id: string;
  courseName: string;
  abstract?: string;
}

interface GeneratedLessonData {
  lesson_id: string;
  sectionCount: number;
}

function CourseBuilderPage() {
  const storeUser = useAuthStore((state) => state.user);
  const { user: routeUser } = Route.useRouteContext();
  const creatorId = storeUser?.id ?? routeUser?.id;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [courseName, setCourseName] = useState("");
  const [courseAbstract, setCourseAbstract] = useState("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<CreatedCourseData | null>(
    null
  );

  // Step 2 state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lessonName, setLessonName] = useState("");
  const [lessonAbstract, setLessonAbstract] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Step 3 state
  const [generatedLesson, setGeneratedLesson] =
    useState<GeneratedLessonData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guard against navigating away during long processing
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isGenerating]);

  // Handle file drop/selection
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please select a valid PDF file");
      return;
    }
    setSelectedFile(file);
    if (!lessonName) {
      // Auto-populate lesson name from filename
      setLessonName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0] ?? null);
    }
  };

  // Step 1: Create Course handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      toast.error("Please provide a course name");
      return;
    }
    if (!creatorId) {
      toast.error("Could not identify the current user. Please log in again.");
      return;
    }

    setIsCreatingCourse(true);
    try {
      const res = await graphqlClient.request<{
        createCourse: {
          isSuccess: boolean;
          message: string;
          courses: Array<{ id: string; courseName: string; abstract: string }>;
        };
      }>(CREATE_COURSE_MUTATION, {
        data: {
          courseName: courseName.trim(),
          abstract: courseAbstract.trim(),
          creatorId,
          isFree: true,
          originalPrice: 0,
        },
      });

      const course = res.createCourse?.courses?.[0];
      if (!course?.id) {
        throw new Error(res.createCourse?.message || "Failed to create course");
      }

      setCreatedCourse(course);
      setStep(2);
      toast.success(
        "Course created! Now upload a PDF to generate the AI lesson."
      );
    } catch (err) {
      toast.error((err as Error).message || "Error creating course");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  // Step 2: Multipart Upload & CreateLessonFromAi handler
  const handleGenerateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload a PDF document");
      return;
    }
    if (!createdCourse?.id) {
      toast.error("No active course found. Please create a course first.");
      setStep(1);
      return;
    }

    setIsGenerating(true);
    setSecondsElapsed(0);

    try {
      const finalLessonName =
        lessonName.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");
      const finalAbstract =
        lessonAbstract.trim() ||
        `Lesson generated automatically from ${selectedFile.name}`;

      const operations = JSON.stringify({
        query: `
          mutation CreateLessonFromAi(
            $data: CreateLessonFromAiInput!
            $pdfFile: Upload!
          ) {
            createLessonFromAi(data: $data, pdfFile: $pdfFile) {
              lesson_id
              content {
                url_pdf
                content
              }
            }
          }
        `,
        variables: {
          data: {
            course_id: createdCourse.id,
            lessonName: finalLessonName,
            abstract: finalAbstract,
          },
          pdfFile: null,
        },
      });

      const map = JSON.stringify({
        "0": ["variables.pdfFile"],
      });

      const formData = new FormData();
      formData.append("operations", operations);
      formData.append("map", map);
      formData.append("0", selectedFile);

      const csrf = await fetchCsrfToken().catch(() => "");
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          ...(csrf ? { "x-csrf-token": csrf } : {}),
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with HTTP status ${response.status}`);
      }

      const resBody = await response.json();
      if (resBody.errors && resBody.errors.length > 0) {
        throw new Error(
          resBody.errors[0]?.message || "Failed to generate lesson from AI"
        );
      }

      const result = resBody.data?.createLessonFromAi;
      const lessonId = result?.lesson_id;
      const sections = result?.content || [];

      if (!lessonId) {
        throw new Error("No lesson ID returned from backend generation");
      }

      setGeneratedLesson({
        lesson_id: lessonId,
        sectionCount: sections.length,
      });
      setStep(3);
      toast.success("AI Lesson generated successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCourseName("");
    setCourseAbstract("");
    setCreatedCourse(null);
    setSelectedFile(null);
    setLessonName("");
    setLessonAbstract("");
    setGeneratedLesson(null);
    setStep(1);
  };

  const handleAddAnotherLesson = () => {
    setSelectedFile(null);
    setLessonName("");
    setLessonAbstract("");
    setGeneratedLesson(null);
    setStep(2);
  };

  return (
    <div className="course-builder-page">
      {/* Header */}
      <div className="cb-header">
        <div className="cb-header__badge">
          <Icon name="lightbulb" size="14px" />
          <span>AI-Powered Generator</span>
        </div>
        <h1 className="cb-header__title">Instructor AI Course Builder</h1>
        <p className="cb-header__subtitle">
          Turn your PDF slides and lecture documents into structured,
          interactive lessons powered by Gemini AI in two simple steps.
        </p>
      </div>

      {/* Stepper */}
      <div className="cb-stepper">
        <div
          className={`cb-stepper__step ${step >= 1 ? "cb-stepper__step--active" : ""} ${step > 1 ? "cb-stepper__step--completed" : ""}`}
        >
          <div className="cb-stepper__circle">
            {step > 1 ? <Icon name="check" size="20px" /> : "1"}
          </div>
          <span className="cb-stepper__label">Course Info</span>
        </div>

        <div
          className={`cb-stepper__line ${step > 1 ? "cb-stepper__line--completed" : ""}`}
        />

        <div
          className={`cb-stepper__step ${step >= 2 ? "cb-stepper__step--active" : ""} ${step > 2 ? "cb-stepper__step--completed" : ""}`}
        >
          <div className="cb-stepper__circle">
            {step > 2 ? <Icon name="check" size="20px" /> : "2"}
          </div>
          <span className="cb-stepper__label">Upload & Generate</span>
        </div>

        <div
          className={`cb-stepper__line ${step === 3 ? "cb-stepper__line--completed" : ""}`}
        />

        <div
          className={`cb-stepper__step ${step === 3 ? "cb-stepper__step--active cb-stepper__step--completed" : ""}`}
        >
          <div className="cb-stepper__circle">
            {step === 3 ? <Icon name="check" size="20px" /> : "3"}
          </div>
          <span className="cb-stepper__label">Ready</span>
        </div>
      </div>

      {/* Step 1: Create Course Form */}
      {step === 1 && (
        <div className="cb-card">
          <h2 className="cb-card__title">Step 1: Course Information</h2>
          <p className="cb-card__desc">
            Define the overarching course topic and description before
            generating lessons.
          </p>

          <form className="cb-form" onSubmit={handleCreateCourse}>
            <div className="cb-form__group">
              <label className="cb-form__label" htmlFor="cb-course-name">
                Course Name <span className="required">*</span>
              </label>
              <input
                id="cb-course-name"
                className="cb-form__input"
                type="text"
                placeholder="e.g. Advanced Operating Systems & Concurrency"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                disabled={isCreatingCourse}
              />
              <p className="cb-form__hint">
                Give your course a clear, recognizable name.
              </p>
            </div>

            <div className="cb-form__group">
              <label className="cb-form__label" htmlFor="cb-course-abstract">
                Course Abstract / Description
              </label>
              <textarea
                id="cb-course-abstract"
                className="cb-form__textarea"
                placeholder="Briefly describe what learners will achieve from this course..."
                value={courseAbstract}
                onChange={(e) => setCourseAbstract(e.target.value)}
                rows={4}
                disabled={isCreatingCourse}
              />
              <p className="cb-form__hint">
                Optional overview that will appear in search results and course
                details.
              </p>
            </div>

            <div className="cb-actions">
              <button
                type="submit"
                className="cb-btn cb-btn--primary"
                disabled={isCreatingCourse || !courseName.trim()}
              >
                {isCreatingCourse ? (
                  <>
                    <Icon name="refresh" size="18px" />
                    <span>Creating Course...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Upload PDF Document</span>
                    <Icon name="arrow_forward" size="18px" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: PDF Upload & AI Lesson Generation */}
      {step === 2 && createdCourse && (
        <div className="cb-card">
          {/* Active Course Banner */}
          <div className="cb-course-banner">
            <div className="cb-course-banner__info">
              <div className="cb-course-banner__icon">
                <Icon name="school" size="22px" />
              </div>
              <div className="cb-course-banner__text">
                <h4>{createdCourse.courseName}</h4>
                <p>
                  Course ID: <code>{createdCourse.id}</code>
                </p>
              </div>
            </div>
            <span className="cb-course-banner__tag">Course Created</span>
          </div>

          <h2 className="cb-card__title">
            Step 2: Upload PDF & Create AI Lesson
          </h2>
          <p className="cb-card__desc">
            Upload your lecture slide deck or textbook PDF. The AI pipeline will
            extract sections, diagrams, and transcripts automatically.
          </p>

          <form className="cb-form" onSubmit={handleGenerateLesson}>
            {/* Dropzone or Preview */}
            {!selectedFile ? (
              <div
                className={`cb-dropzone ${isDragOver ? "cb-dropzone--drag-over" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="cb-dropzone__icon">
                  <Icon name="attach_file" size="28px" />
                </div>
                <h4 className="cb-dropzone__title">
                  Click to browse or drag and drop your PDF here
                </h4>
                <p className="cb-dropzone__subtitle">
                  Supports PDF lecture slides, handouts, and notes (up to 50MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="cb-dropzone__file-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileChange(e.target.files[0] ?? null);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="cb-file-preview">
                <div className="cb-file-preview__meta">
                  <div className="cb-file-preview__icon">
                    <Icon name="description" size="24px" />
                  </div>
                  <div className="cb-file-preview__details">
                    <h5>{selectedFile.name}</h5>
                    <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="cb-file-preview__remove"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  title="Remove selected file"
                >
                  <Icon name="close" size="20px" />
                </button>
              </div>
            )}

            {/* Lesson Metadata */}
            <div className="cb-form__group">
              <label className="cb-form__label" htmlFor="cb-lesson-name">
                Lesson Name <span className="required">*</span>
              </label>
              <input
                id="cb-lesson-name"
                className="cb-form__input"
                type="text"
                placeholder="e.g. Chapter 1: Introduction to Data Structures"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                required
                disabled={isGenerating}
              />
            </div>

            <div className="cb-form__group">
              <label className="cb-form__label" htmlFor="cb-lesson-abstract">
                Lesson Abstract
              </label>
              <textarea
                id="cb-lesson-abstract"
                className="cb-form__textarea"
                placeholder="Optional summary of this specific lesson..."
                value={lessonAbstract}
                onChange={(e) => setLessonAbstract(e.target.value)}
                rows={3}
                disabled={isGenerating}
              />
            </div>

            <div className="cb-actions">
              <button
                type="button"
                className="cb-btn cb-btn--secondary"
                onClick={() => setStep(1)}
                disabled={isGenerating}
              >
                Back
              </button>
              <button
                type="submit"
                className="cb-btn cb-btn--primary"
                disabled={isGenerating || !selectedFile}
              >
                <Icon name="lightbulb" size="18px" />
                <span>Generate AI Lesson</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && generatedLesson && createdCourse && (
        <div className="cb-card">
          <div className="cb-success">
            <div className="cb-success__icon">
              <Icon name="check_circle" size="44px" />
            </div>
            <h2 className="cb-success__title">
              AI Lesson Generated Successfully!
            </h2>
            <p className="cb-success__desc">
              Your document was analyzed and converted into structured sections,
              complete with lecture notes and interactive chatbot study
              materials.
            </p>

            <div className="cb-success__card">
              <p>
                <strong>Course:</strong> {createdCourse.courseName}
              </p>
              <p>
                <strong>Lesson Name:</strong> {lessonName}
              </p>
              <p>
                <strong>Lesson ID:</strong>{" "}
                <code>{generatedLesson.lesson_id}</code>
              </p>
              <p>
                <strong>Generated Sections:</strong>{" "}
                {generatedLesson.sectionCount > 0
                  ? generatedLesson.sectionCount
                  : "Completed"}
              </p>
            </div>

            <div className="cb-success__buttons">
              <Link
                to="/learner/lessons/$lessonId"
                params={{ lessonId: generatedLesson.lesson_id }}
                className="cb-btn cb-btn--primary"
              >
                <Icon name="visibility" size="18px" />
                <span>Preview Lesson UI</span>
              </Link>
              <button
                type="button"
                className="cb-btn cb-btn--secondary"
                onClick={handleAddAnotherLesson}
              >
                <Icon name="add" size="18px" />
                <span>Add Another Lesson</span>
              </button>
              <button
                type="button"
                className="cb-btn cb-btn--secondary"
                onClick={handleReset}
              >
                <span>New Course</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Critical Blocking Modal State */}
      {isGenerating && (
        <div className="cb-blocking-overlay">
          <div className="cb-blocking-overlay__box">
            <div className="cb-blocking-overlay__spinner" />
            <h3 className="cb-blocking-overlay__title">
              AI is analyzing your document...
            </h3>
            <p className="cb-blocking-overlay__desc">
              Gemini is breaking down your PDF into structured sections,
              synthesizing markdown transcriptions, and building lesson
              materials.
            </p>

            <div className="cb-blocking-overlay__progress-bar">
              <div className="cb-blocking-overlay__progress-bar-inner" />
            </div>

            <p className="cb-blocking-overlay__warning">
              <Icon name="hourglass_empty" size="16px" />
              <span>
                Elapsed: {secondsElapsed}s · Please wait up to 60 seconds. Do
                not refresh or close this window.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
