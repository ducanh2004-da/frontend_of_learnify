import { useState, useCallback } from "react";
import { z } from "zod";
import { useRegister } from "@/hooks/useRegister";
import { logger } from "@/utils/logger";

export type TSignUpStep1 = {
  firstName: string;
  lastName: string;
  email: string;
};

export type TSignUpStep2 = {
  password: string;
  confirmPassword: string;
};

export type TVerificationData = {
  code: string[];
};

export type TFormErrors = Record<string, string>;

export const signUpStep1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
  }),
});

export const signUpStep2Schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Please enter a valid 6-digit code")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const useSignUpForm = () => {
  const register = useRegister();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [step1Data, setStep1Data] = useState<TSignUpStep1>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [step1Errors, setStep1Errors] = useState<TFormErrors>({});

  const [step2Data, setStep2Data] = useState<TSignUpStep2>({
    password: "",
    confirmPassword: "",
  });

  const [step2Errors, setStep2Errors] = useState<TFormErrors>({});

  const [verificationData, setVerificationData] = useState<{ email: string }>({
    email: "",
  });
  const [verificationErrors, setVerificationErrors] = useState<TFormErrors>({});

  const handleStep1Change = useCallback(
    (field: keyof TSignUpStep1, value: string) => {
      setStep1Data((prev) => ({ ...prev, [field]: value }));
      setStep1Errors((prev) => {
        if (!prev[field]) return prev;
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    },
    []
  );

  const handleStep1Submit = useCallback(() => {
    const result = signUpStep1Schema.safeParse(step1Data);
    if (!result.success) {
      const validationErrors: TFormErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          validationErrors[issue.path[0] as string] = issue.message;
        }
      });
      setStep1Errors(validationErrors);
      return false;
    }
    setStep1Errors({});
    setStep(2);
    return true;
  }, [step1Data]);

  const handleStep2Change = useCallback(
    (field: keyof TSignUpStep2, value: string) => {
      setStep2Data((prev) => ({ ...prev, [field]: value }));
      setStep2Errors((prev) => {
        if (!prev[field]) return prev;
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    },
    []
  );

  const handleStep2Submit = useCallback(async () => {
    const result = signUpStep2Schema.safeParse(step2Data);
    if (!result.success) {
      const validationErrors: TFormErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          validationErrors[issue.path[0] as string] = issue.message;
        }
      });
      setStep2Errors(validationErrors);
      return false;
    }

    const fullName = `${step1Data.firstName} ${step1Data.lastName}`;
    try {
      const result = await register.mutateAsync({
        data: {
          username: fullName,
          email: step1Data.email,
          password: step2Data.password,
          phoneNumber: "",
        },
      });

      if (result.register.success) {
        setStep(3);
        return true;
      }
      return false;
    } catch (error) {
      setStep2Errors({
        api:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      });
      return false;
    }
  }, [step1Data, step2Data, register]);

  const handleVerificationChange = useCallback(
    (index: number, value: string) => {
      setVerificationData((prev) => ({ ...prev, email: value }));
      setVerificationErrors((prev) => {
        if (!prev.email) return prev;
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    },
    []
  );

  const handleVerificationSubmit = useCallback(async () => {
    try {
      const { graphqlClient } = await import("@/lib/graphql");
      const { VERIFY_EMAIL_MUTATION } = await import("@/graphql/mutations");
      await graphqlClient.request(VERIFY_EMAIL_MUTATION, {
        email: verificationData.email,
        code: "",
      });
      window.location.href = "/learner";
      return true;
    } catch {
      setVerificationErrors({ api: "Verification failed. Please try again." });
      return false;
    }
  }, [verificationData.email]);

  const handleResend = useCallback(async () => {
    try {
      const { graphqlClient } = await import("@/lib/graphql");
      const { RESEND_VERIFICATION_MUTATION } =
        await import("@/graphql/mutations");
      await graphqlClient.request(RESEND_VERIFICATION_MUTATION, {
        email: verificationData.email,
      });
    } catch {
      logger.error("Failed to resend code");
    }
  }, [verificationData.email]);

  const handleGoBack = useCallback(() => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }, [step]);

  return {
    step,
    step1Data,
    step1Errors,
    step2Data,
    step2Errors,
    verificationData,
    verificationErrors,
    isPending: register.isPending,
    onStep1Change: handleStep1Change,
    onStep1Submit: handleStep1Submit,
    onStep2Change: handleStep2Change,
    onStep2Submit: handleStep2Submit,
    onVerificationChange: handleVerificationChange,
    onVerificationSubmit: handleVerificationSubmit,
    onResend: handleResend,
    onGoBack: handleGoBack,
  };
};
