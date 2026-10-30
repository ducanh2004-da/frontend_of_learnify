import type { TFormErrors } from "../../-hooks/useSignUpForm";

export type TSignUpVerificationData = {
  email: string;
};

export type TSignUpVerificationProps = {
  data: TSignUpVerificationData;
  errors: TFormErrors;
  isPending: boolean;
  isResending: boolean;
  onChange: (index: number, value: string) => void;
  onSubmit: () => Promise<boolean>;
  onResend: () => Promise<void>;
};
