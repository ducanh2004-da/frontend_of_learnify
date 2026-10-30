import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { memo } from "react";
import type { TSignUpStep1Props } from "./type.d";
import "./style.scss";

const SignUpStep1 = memo(function SignUpStep1({
  data,
  errors,
  onChange,
  onSubmit,
}: TSignUpStep1Props) {
  const { t } = useTranslation();

  return (
    <form
      className="sign-up__form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="sign-up__name-row">
        <div>
          <input
            className={classnames("sign-up__input", {
              "sign-up__input--error": errors.firstName,
            })}
            type="text"
            aria-label={t("auth.signup.first_name")}
            placeholder={t("auth.signup.first_name")}
            id="sign-up-first-name"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          {errors.firstName && (
            <p className="sign-up__error">{errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            className={classnames("sign-up__input", {
              "sign-up__input--error": errors.lastName,
            })}
            type="text"
            aria-label={t("auth.signup.last_name")}
            placeholder={t("auth.signup.last_name")}
            id="sign-up-last-name"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
          {errors.lastName && (
            <p className="sign-up__error">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <input
          className={classnames("sign-up__input", {
            "sign-up__input--error": errors.email,
          })}
          type="email"
          aria-label={t("auth.signup.email_label")}
          placeholder={t("auth.signup.email_placeholder")}
          id="sign-up-email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {errors.email && <p className="sign-up__error">{errors.email}</p>}
      </div>

      <button
        className="sign-up__submit sign-up__button"
        type="submit"
        id="sign-up-continue-btn"
      >
        <h6 className="semibold">{t("auth.signup.continue")}</h6>
      </button>
    </form>
  );
});

export default SignUpStep1;
