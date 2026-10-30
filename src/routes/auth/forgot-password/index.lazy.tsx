import { createLazyFileRoute } from "@tanstack/react-router";
import ForgotPasswordStep1 from "../-components/ForgotPasswordStep1";
import ForgotPasswordStep2 from "../-components/ForgotPasswordStep2";
import Logo from "@/components/Logo";
import AuthControls from "../-components/AuthControls";
import { useForgotPasswordForm } from "../-hooks/useForgotPasswordForm";

export const Route = createLazyFileRoute("/auth/forgot-password/")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const {
    step,
    step1Data,
    step1Errors,
    step2Data,
    step2Errors,
    isPending,
    isResending,
    onStep1Change,
    onStep1Submit,
    onStep2Change,
    onStep2Submit,
    onResend,
    onGoBack,
  } = useForgotPasswordForm();

  return (
    <div className="forgot-password" id="forgot-password-page">
      <Logo size="medium" to="/" className="forgot-password__logo" />
      <AuthControls className="forgot-password__auth-controls" />
      {step === 1 && (
        <ForgotPasswordStep1
          data={step1Data}
          errors={step1Errors}
          isPending={isPending}
          onChange={onStep1Change}
          onSubmit={onStep1Submit}
        />
      )}
      {step === 2 && (
        <ForgotPasswordStep2
          data={step2Data}
          errors={step2Errors}
          isPending={isPending}
          isResending={isResending}
          onChange={onStep2Change}
          onSubmit={onStep2Submit}
          onResend={onResend}
          onBack={onGoBack}
        />
      )}
    </div>
  );
}
