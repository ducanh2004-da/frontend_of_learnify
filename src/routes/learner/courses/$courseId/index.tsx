import "./courseId.scss";

import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ErrorScene from "@/components/ErrorScene";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { createLearnerHead } from "@/utils";
import { courseQueryOptions } from "@/utils/courses";
import { logger } from "@/utils/logger";
import RouterComponentHolder from "@/components/RouterComponentHolder";

function CourseErrorComponent() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("course_detail.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("course_detail.load_error")}
        </ErrorScene.Description>
      </ErrorScene.Header>
      <ErrorScene.Content>
        <div className="error-scene__control">
          <TextButton
            text={t("errors.try_again")}
            onClick={() => router.invalidate()}
            className="error-scene__btn"
            size="medium"
            icon="refresh"
          />
          <TextButton
            text={t("errors.go_back")}
            onClick={() => window.history.back()}
            className="error-scene__btn error-scene__btn--secondary"
            size="medium"
            icon="arrow_back"
            type="outlined"
          />
        </div>
      </ErrorScene.Content>
    </ErrorScene>
  );
}

export const Route = createFileRoute("/learner/courses/$courseId/")({
  loader: async ({ params: { courseId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      courseQueryOptions(courseId)
    );
    logger.debug("data", data);
    if (!data.getCourseById) throw notFound();
    return { title: data.getCourseById?.courseName };
  },
  head: ({ loaderData }) =>
    createLearnerHead(loaderData?.title ?? "Course Details"),
  errorComponent: CourseErrorComponent,
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
