import { useTranslation } from "react-i18next";
import { memo } from "react";
import Icon from "@/components/Icon";
import type { TSignUpVerificationProps } from "./type.d";
import "./style.scss";

const SignUpVerification = memo(function SignUpVerification({
  data,
  errors: _errors,
  isPending: _isPending,
  isResending,
  onChange: _onChange,
  onSubmit: _onSubmit,
  onResend,
}: TSignUpVerificationProps) {
  const { t } = useTranslation();

  return (
    <div className="sign-up-verification">
      <div className="sign-up-verification__icon">
        <Icon name="mark_email_unread" />
      </div>

      <h3 className="semibold">{t("auth.signup.verification_title")}</h3>

      <p className="regular sign-up-verification__desc">
        {t("auth.signup.verification_description")} <br />
        <span className="bold sign-up-verification__email-highlight">
          {data.email}
        </span>
      </p>

      <p className="regular sign-up-verification__subtext">
        {t("auth.signup.verification_subtext")}
      </p>

      <button
        className="sign-up-verification__continue-btn"
        type="button"
        disabled={isResending}
        onClick={onResend}
      >
        <h6 className="semibold">
          {isResending ? t("auth.signup.resending") : t("auth.signup.resend")}
        </h6>
      </button>
    </div>
  );
});

export default SignUpVerification;
