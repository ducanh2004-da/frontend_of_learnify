export type TForgotPasswordStep2Data = {
  code: string[];
};

export type TForgotPasswordStep2Props = {
  data: TForgotPasswordStep2Data;
  errors: Record<string, string>;
  isPending: boolean;
  isResending: boolean;
  onChange: (index: number, value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
};
