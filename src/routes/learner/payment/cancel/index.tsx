import "./style.scss";

import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";

const payosCancelSchema = z.object({
  orderCode: z.string().catch(""),
  status: z.string().catch(""),
  cancel: z
    .string()
    .transform((val) => val === "true")
    .catch(false),
});

export const Route = createFileRoute("/learner/payment/cancel/")({
  validateSearch: (search) => payosCancelSchema.parse(search),
  component: PaymentCancelComponent,
});

function PaymentCancelComponent() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();

  const handleRetry = () => {
    navigate({ to: "/learner/courses", search: { q: "" } });
  };

  const handleGoBack = () => {
    router.history.back();
  };

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="payment-cancel">
      <div className="payment-cancel__card">
        <div className="payment-cancel__icon">
          <Icon name="cancel" />
        </div>
        <h1 className="payment-cancel__title">{t("payment.cancel_title")}</h1>
        <p className="payment-cancel__desc">{t("payment.cancel_desc")}</p>

        {searchParams.orderCode && (
          <div className="payment-cancel__details">
            <h3 className="payment-cancel__details-title">
              {t("payment.cancel_order_label")}
            </h3>

            <div className="payment-cancel__details-row">
              <span className="payment-cancel__details-label">
                {t("payment.cancel_order_label")}
              </span>
              <span className="payment-cancel__details-value">
                {searchParams.orderCode}
              </span>
            </div>

            {searchParams.status && (
              <div className="payment-cancel__details-row">
                <span className="payment-cancel__details-label">
                  {t("payment.cancel_status_label")}
                </span>
                <span
                  className={classnames(
                    "payment-cancel__details-value",
                    "payment-cancel__details-value--badge"
                  )}
                >
                  {t("payment.cancel_status_value")}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="payment-cancel__actions">
          <button
            onClick={handleRetry}
            className={classnames(
              "payment-cancel__btn",
              "payment-cancel__btn--primary"
            )}
          >
            <Icon name="refresh" /> {t("payment.cancel_retry")}
          </button>

          <button
            onClick={handleGoBack}
            className={classnames(
              "payment-cancel__btn",
              "payment-cancel__btn--secondary"
            )}
          >
            <Icon name="arrow_back" /> {t("payment.cancel_go_back")}
          </button>

          <button
            onClick={handleGoHome}
            className={classnames(
              "payment-cancel__btn",
              "payment-cancel__btn--text"
            )}
          >
            {t("payment.cancel_go_home")}
          </button>
        </div>

        <div className="payment-cancel__support">
          <p>{t("payment.cancel_support")}</p>
          <a href="mailto:support@learnify.io.vn">
            {t("payment.cancel_support_link")}
          </a>
        </div>
      </div>
    </div>
  );
}
