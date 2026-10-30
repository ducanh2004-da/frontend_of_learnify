export type TLogInForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type TLogInFormProps = {
  data: TLogInForm;
  errors: Record<string, string>;
  isPending: boolean;
  onChange: (field: keyof TLogInForm, value: string | boolean) => void;
  onSubmit: () => void;
};
