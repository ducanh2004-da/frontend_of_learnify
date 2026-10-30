export type TForgotPasswordStep1Data = {
  email: string;
};

export type TForgotPasswordStep1Props = {
  data: TForgotPasswordStep1Data;
  errors: Record<string, string>;
  isPending: boolean;
  onChange: (field: keyof TForgotPasswordStep1Data, value: string) => void;
  onSubmit: () => void;
};
