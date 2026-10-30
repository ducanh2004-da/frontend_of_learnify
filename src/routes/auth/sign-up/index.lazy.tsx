import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import CustomLink from "@/components/CustomLink";
import Logo from "@/components/Logo";
import { GoogleLogin } from "@react-oauth/google";
import { useSignUpForm } from "../-hooks/useSignUpForm";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import SignUpStep1 from "../-components/SignUpStep1";
import SignUpStep2 from "../-components/SignUpStep2";
import SignUpVerification from "../-components/SignUpVerification";
import SignUpRight from "../-components/SignUpRight";
import AuthControls from "../-components/AuthControls";
import { logger } from "@/utils/logger";

export const Route = createLazyFileRoute("/auth/sign-up/")({
  component: SignUpPage,
});

function SignUpPage() {
  const { t } = useTranslation();
  const {
    step,
    step1Data,
    step1Errors,
    step2Data,
    step2Errors,
    verificationErrors,
    isPending,
    onStep1Change,
    onStep1Submit,
    onStep2Change,
    onStep2Submit,
    onVerificationChange,
    onVerificationSubmit,
    onResend,
    onGoBack,
  } = useSignUpForm();
  const googleLoginMutation = useGoogleLogin();
  const navigate = useNavigate();

  return (
    <div className="sign-up" id="sign-up-page">
      <Logo size="medium" className="sign-up__logo" to="/" />
      <AuthControls className="sign-up__auth-controls" />

      <div className="sign-up__card">
        <div className="sign-up__left">
          <h3 className="semibold">{t("auth.signup.title")}</h3>

          <div className="sign-up__google-container">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse?.credential) {
                  logger.error("Google login failed: no credential returned");
                  return;
                }
                const idToken = credentialResponse.credential;
                googleLoginMutation.mutate(idToken, {
                  onSuccess: () => {
                    navigate({ to: "/learner" });
                  },
                });
              }}
              onError={() => {
                logger.error("Google login failed");
              }}
              useOneTap
              theme="outline"
              text="continue_with"
              shape="circle"
            />
          </div>

          <div className="sign-up__divider">
            <p className="regular">{t("auth.signup.or")}</p>
          </div>

          {step === 1 && (
            <SignUpStep1
              data={step1Data}
              errors={step1Errors}
              onChange={onStep1Change}
              onSubmit={onStep1Submit}
            />
          )}

          {step === 2 && (
            <SignUpStep2
              data={step2Data}
              errors={step2Errors}
              isPending={isPending}
              onChange={onStep2Change}
              onSubmit={onStep2Submit}
              onBack={onGoBack}
            />
          )}

          {step === 3 && (
            <SignUpVerification
              data={{ email: step1Data.email }}
              errors={verificationErrors}
              isPending={isPending}
              isResending={false}
              onChange={onVerificationChange}
              onSubmit={onVerificationSubmit}
              onResend={onResend}
            />
          )}

          <p className="sign-up__signin-link regular">
            {t("auth.signup.already_using")}{" "}
            <CustomLink to="/auth/log-in">{t("auth.signup.log_in")}</CustomLink>
          </p>
        </div>

        <div className="sign-up__separator" />

        <SignUpRight />
      </div>
    </div>
  );
}
