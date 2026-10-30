import { useAuthStore } from "@/store";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";
import SubscriptionCard from "./-components/SubscriptionCard";
import { SUBSCRIPTIONS } from "./-constants";

export const Route = createLazyFileRoute("/learner/subscriptions/")({
  component: SubscriptionComponent,
});

function SubscriptionComponent() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const userSubscription = user
    ? SUBSCRIPTIONS.find(
        (subscription) => subscription.type === user.subscription
      )
    : null;

  return (
    <div className="subscriptions">
      <h2 className="subscriptions__heading">
        <Trans
          key={i18n.language}
          i18nKey="subscriptions.heading"
          components={{ Beauty: <span className="beauty" /> }}
        />
      </h2>
      <h6 className="subscriptions__subtitle">{t("subscriptions.subtitle")}</h6>
      <section className="subscriptions__cards">
        {SUBSCRIPTIONS.map((subscription) => (
          <SubscriptionCard
            key={subscription.type}
            type={subscription.type}
            icon={subscription.icon}
            disabled={userSubscription?.type === subscription.type || false}
            trial={subscription.type === "Pro"}
          />
        ))}
      </section>
    </div>
  );
}
