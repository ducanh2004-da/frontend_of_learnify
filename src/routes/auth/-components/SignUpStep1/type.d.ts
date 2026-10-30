export type TSignUpStep1 = {
  firstName: string;
  lastName: string;
  email: string;
};

export type TSignUpStep1Props = {
  data: TSignUpStep1;
  errors: Record<string, string>;
  onChange: (field: keyof TSignUpStep1, value: string) => void;
  onSubmit: () => void;
};
