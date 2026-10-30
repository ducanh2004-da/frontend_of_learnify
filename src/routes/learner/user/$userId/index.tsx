import "./userId.scss";

import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import ErrorScene from "@/components/ErrorScene";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { GET_PROFILE } from "@/graphql/user";
import type { GetUserProfileResponse } from "@/hooks/useProfile";
import { graphqlClient } from "@/lib/graphql";
import { createLearnerHead } from "@/utils";

function UserErrorComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("profile.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("profile.load_error")}
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

export const Route = createFileRoute("/learner/user/$userId/")({
  loader: async ({ params: { userId }, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ["user", "profile", userId],
      queryFn: async () => {
        try {
          return await graphqlClient.request<GetUserProfileResponse>(
            GET_PROFILE,
            { userId }
          );
        } catch {
          throw new Error(i18n.t("profile.failed_fetch"));
        }
      },
    });
    if (!data.currentUser?.users?.length) throw notFound();
    return { title: data.currentUser.users[0]?.username };
  },
  head: ({ loaderData }) =>
    createLearnerHead(loaderData?.title ?? i18n.t("profile.head_title")),
  errorComponent: UserErrorComponent,
  pendingComponent: TetrisLoader,
  notFoundComponent: NotFound,
}).lazy(() => import("./index.lazy").then((m) => m.Route));
