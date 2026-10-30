import "./friends.scss";

import ErrorScene from "@/components/ErrorScene";
import NotFound from "@/components/NotFound";
import RouterComponentHolder from "@/components/RouterComponentHolder";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { getCurrentUserFn } from "@/server/auth";
import { createLearnerHead } from "@/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function FriendsErrorComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("errors.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("errors.load_friends")}
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

export const Route = createFileRoute("/learner/friends/")({
  beforeLoad: async () => {
    const { user } = await getCurrentUserFn();
    return { user };
  },
  head: () => createLearnerHead("Friends"),
  errorComponent: () => (
    <RouterComponentHolder children={<FriendsErrorComponent />} />
  ),
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
