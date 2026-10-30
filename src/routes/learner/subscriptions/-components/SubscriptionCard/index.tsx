import Icon, { type TIconName } from "@/components/Icon";
import TextButton from "@/components/TextButton";
import { Trans, useTranslation } from "react-i18next";
import SubscriptionButton from "../SubscriptionButton";
import "./style.scss";

type TSubscriptionCardProps = {
  type: "Starter" | "Pro" | "Career";
  trial?: boolean;
  icon: TIconName;
  disabled?: boolean;
};

const planKeyMap: Record<string, string> = {
  Starter: "starter",
  Pro: "pro",
  Career: "career",
};

const SubscriptionCard = (props: TSubscriptionCardProps) => {
  const { t, i18n } = useTranslation();
  const { type, icon, disabled, trial } = props;
  const planKey = planKeyMap[type];
  const title = t(`subscriptions.${planKey}.title`);
  const subtitle = t(`subscriptions.${planKey}.subtitle`);

  const descriptionCount = t(`subscriptions.${planKey}.descriptions`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className="subscription-card">
      <div className="subscription-card__content">
        <TextButton
          icon={icon}
          type="secondary"
          size="tiny"
          typeSecondary="pastelGreen"
          text={title}
          onClick={() => {}}
        />
        <center className="subscription-card__content-detail">
          <h3 className="subscription-card__content-detail__price">
            <Trans
              key={i18n.language}
              i18nKey={`subscriptions.${planKey}.price`}
              components={[<strong className="bold" />]}
            />
          </h3>
          <p className="subscription-card__content-detail__subtitle">
            {subtitle}
          </p>
          <ul className="subscription-card__content-detail__description">
            {descriptionCount.map((_, index) => (
              <li
                className="subscription-card__content-detail__description-item"
                key={index}
              >
                <Icon name="check" />
                <div className="subscription-card__content-detail__description-item-text">
                  <Trans
                    key={`${i18n.language}-${index}`}
                    i18nKey={`subscriptions.${planKey}.descriptions.${index}`}
                    components={[<strong />]}
                  />
                </div>
              </li>
            ))}
          </ul>
        </center>
      </div>
      <SubscriptionButton
        text={trial ? t("subscriptions.free-trial") : t("subscriptions.select")}
        className="subscription-button-select"
        disabled={disabled}
      />
      <SubscriptionButton
        text={t("subscriptions.learn_more")}
        className="subscription-button-learn-more"
      />
    </div>
  );
};

export default SubscriptionCard;
