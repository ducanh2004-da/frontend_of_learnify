import { useTranslation } from "react-i18next";
import classnames from "classnames";
import CustomLink from "@/components/CustomLink";
import type { TForgotPasswordStep1Props } from "./type.d";
import "./style.scss";

const ForgotPasswordStep1 = ({
  data,
  errors,
  isPending,
  onChange,
  onSubmit,
}: TForgotPasswordStep1Props) => {
  const { t } = useTranslation();

  return (
    <div className="forgot-password-step1">
      <div className="forgot-password-step1__container">
        <div className="forgot-password-step1__content">
          <h3 className="semibold">{t("auth.forgot_password.title")}</h3>
          <p className="regular">{t("auth.forgot_password.description")}</p>

          <form
            className="forgot-password-step1__form"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div>
              <label htmlFor="forgot-email" className="sr-only">
                {t("auth.forgot_password.email_label")}
              </label>
              <input
                id="forgot-email"
                className={classnames("forgot-password-step1__input", {
                  "forgot-password-step1__input--error": errors.email,
                })}
                type="email"
                placeholder={t("auth.forgot_password.email_placeholder")}
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="forgot-password-step1__error">{errors.email}</p>
              )}
            </div>

            <button
              className="forgot-password-step1__submit-btn"
              type="submit"
              disabled={isPending}
            >
              <h6 className="semibold">{t("auth.forgot_password.submit")}</h6>
            </button>
          </form>

          <p className="forgot-password-step1-back-link regular">
            {t("auth.forgot_password.remember_password")}{" "}
            <CustomLink to="/auth/log-in">
              {t("auth.forgot_password.log_in")}
            </CustomLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStep1;
