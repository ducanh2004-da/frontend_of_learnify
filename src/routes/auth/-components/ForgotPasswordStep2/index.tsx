import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { useRef } from "react";
import type { TForgotPasswordStep2Props } from "./type.d";
import "./style.scss";

const ForgotPasswordStep2 = ({
  data,
  errors,
  isPending,
  isResending,
  onChange,
  onSubmit,
  onResend,
  onBack,
}: TForgotPasswordStep2Props) => {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    onChange(index, numericValue);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !data.code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="forgot-password-step2">
      <div className="forgot-password-step2__container">
        <div className="forgot-password-step2__content">
          <h3 className="semibold">{t("auth.forgot_password.verify_title")}</h3>
          <p className="regular">
            {t("auth.forgot_password.verify_description")}
          </p>

          <form
            className="forgot-password-step2__code-input"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {data.code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                aria-label={t("auth.forgot_password.digit_aria", {
                  n: index + 1,
                })}
                className={classnames("forgot-password-step2__code-digit", {
                  "forgot-password-step2__code-digit--error": errors.code,
                })}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </form>

          {errors.code && (
            <p className="forgot-password-step2__error">{errors.code}</p>
          )}

          <button
            className="forgot-password-step2__verify-btn"
            type="submit"
            disabled={isPending}
          >
            <h6 className="semibold">
              {t("auth.forgot_password.verify_code")}
            </h6>
          </button>

          <p className="forgot-password-step2__resend-link regular">
            {t("auth.forgot_password.resend_link")}{" "}
            <button
              className="forgot-password-step2__resend-action"
              type="button"
              disabled={isResending}
              onClick={onResend}
            >
              {t("auth.forgot_password.resend_here")}
            </button>
          </p>

          <p className="forgot-password-step2__back-link regular">
            <button
              className="forgot-password-step2__back-action"
              type="button"
              onClick={onBack}
            >
              {t("auth.forgot_password.back")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStep2;
