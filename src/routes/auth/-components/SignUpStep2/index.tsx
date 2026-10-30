import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { memo, useState } from "react";
import Icon from "@/components/Icon";
import type { TSignUpStep2Props } from "./type.d";
import "./style.scss";

const SignUpStep2 = memo(function SignUpStep2({
  data,
  errors,
  isPending,
  onChange,
  onSubmit,
  onBack,
}: TSignUpStep2Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form
      className="sign-up__form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <button className="sign-up__back" type="button" onClick={onBack}>
        <Icon name="arrow_back" />
        <p className="regular">{t("auth.signup.back")}</p>
      </button>

      <div>
        <div className="sign-up__password-wrapper">
          <input
            className={classnames("sign-up__input", {
              "sign-up__input--error": errors.password,
            })}
            type={showPassword ? "text" : "password"}
            aria-label={t("auth.signup.password_label")}
            placeholder={t("auth.signup.password_placeholder")}
            id="sign-up-password"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <button
            type="button"
            className="sign-up__password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "visibility" : "visibility_off"} />
          </button>
        </div>
        {errors.password && <p className="sign-up__error">{errors.password}</p>}
      </div>

      <div>
        <div className="sign-up__password-wrapper">
          <input
            className={classnames("sign-up__input", {
              "sign-up__input--error": errors.confirmPassword,
            })}
            type={showConfirm ? "text" : "password"}
            aria-label={t("auth.signup.confirm_password_label")}
            placeholder={t("auth.signup.confirm_password_placeholder")}
            id="sign-up-confirm-password"
            value={data.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
          />
          <button
            type="button"
            className="sign-up__password-toggle"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            <Icon name={showConfirm ? "visibility" : "visibility_off"} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="sign-up__error">{errors.confirmPassword}</p>
        )}
      </div>

      {errors.api && (
        <p className="sign-up__error sign-up__api-error">{errors.api}</p>
      )}

      <button
        className="sign-up__submit sign-up__button"
        type="submit"
        id="sign-up-submit-btn"
        disabled={isPending}
      >
        <h6 className="semibold">
          {isPending ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </h6>
      </button>
    </form>
  );
});

export default SignUpStep2;
