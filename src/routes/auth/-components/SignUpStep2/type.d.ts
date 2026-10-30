export type TSignUpStep2 = {
  password: string;
  confirmPassword: string;
};

export type TSignUpStep2Props = {
  data: TSignUpStep2;
  errors: Record<string, string>;
  isPending: boolean;
  onChange: (field: keyof TSignUpStep2, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};
