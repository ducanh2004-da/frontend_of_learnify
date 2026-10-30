import "./marketing.scss";

import ErrorScene from "@/components/ErrorScene";
import NotFound from "@/components/NotFound";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type TMarketingHolderProps = {
  children: ReactNode;
};

function MarketingHolder({ children }: TMarketingHolderProps) {
  return <div className="marketing-holder">{children}</div>;
}

export function MarketingErrorComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <MarketingHolder>
      <ErrorScene>
        <ErrorScene.Header>
          <ErrorScene.Title errorCode={500}>
            {t("errors.server_error")}
          </ErrorScene.Title>
          <ErrorScene.Description>
            {t("errors.load_generic")}
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
    </MarketingHolder>
  );
}

export function MarketingPendingComponent() {
  return (
    <MarketingHolder>
      <TetrisLoader />
    </MarketingHolder>
  );
}

export function MarketingNotFoundComponent() {
  return (
    <MarketingHolder>
      <NotFound />
    </MarketingHolder>
  );
}

export const marketingRouteConfig = {
  errorComponent: MarketingErrorComponent,
  pendingComponent: MarketingPendingComponent,
  notFoundComponent: MarketingNotFoundComponent,
} as const;
