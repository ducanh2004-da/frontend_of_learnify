import "./roadmapId.scss";

import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ErrorScene from "@/components/ErrorScene";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { createLearnerHead } from "@/utils";
import { roadmapQueryOptions } from "@/utils/roadmaps";

function RoadmapErrorComponent() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("errors.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("errors.load_roadmap")}
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

export const Route = createFileRoute("/learner/roadmaps/$roadmapId/")({
  loader: async ({ params: { roadmapId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      roadmapQueryOptions(roadmapId)
    );
    const roadmapDetail = data.getRoadmapById.roadmap[0];
    if (!roadmapDetail) throw notFound();
    return { title: roadmapDetail.roadMapName };
  },
  head: ({ loaderData }) =>
    createLearnerHead(loaderData?.title ?? "Roadmap Detail"),
  errorComponent: RoadmapErrorComponent,
  pendingComponent: TetrisLoader,
  notFoundComponent: NotFound,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
