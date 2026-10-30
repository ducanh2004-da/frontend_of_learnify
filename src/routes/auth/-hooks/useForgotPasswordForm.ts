import { useState, useCallback } from "react";
import { z } from "zod";
import { logger } from "@/utils/logger";

export type TForgotPasswordStep1Data = {
  email: string;
};

export type TForgotPasswordStep2Data = {
  code: string[];
};

export type TFormErrors = Record<string, string>;

export const forgotPasswordStep1Schema = z.object({
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
    error: "Please enter a valid email address",
  }),
});

export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Please enter a valid 6-digit code")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const useForgotPasswordForm = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const [step1Data, setStep1Data] = useState<TForgotPasswordStep1Data>({
    email: "",
  });

  const [step1Errors, setStep1Errors] = useState<TFormErrors>({});

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [step2Errors, setStep2Errors] = useState<TFormErrors>({});

  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleStep1Change = useCallback(
    (field: keyof TForgotPasswordStep1Data, value: string) => {
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

  const handleStep1Submit = useCallback(async () => {
    const result = forgotPasswordStep1Schema.safeParse(step1Data);
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

    try {
      setIsPending(true);
      const { graphqlClient } = await import("@/lib/graphql");
      const { SEND_RESET_CODE_MUTATION } = await import("@/graphql/mutations");
      await graphqlClient.request(SEND_RESET_CODE_MUTATION, {
        email: step1Data.email,
      });
      setStep(2);
      return true;
    } catch {
      setStep1Errors({ api: "Failed to send reset code. Please try again." });
      return false;
    } finally {
      setIsPending(false);
    }
  }, [step1Data]);

  const handleStep2Change = useCallback((index: number, value: string) => {
    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = value;
      return newCode;
    });
    setStep2Errors((prev) => {
      if (!prev.code) return prev;
      const newErrors = { ...prev };
      delete newErrors.code;
      return newErrors;
    });
  }, []);

  const handleStep2Submit = useCallback(async () => {
    const codeString = code.join("");
    const result = verificationSchema.safeParse({ code: codeString });
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

    try {
      setIsPending(true);
      const { graphqlClient } = await import("@/lib/graphql");
      const { VERIFY_RESET_CODE_MUTATION } =
        await import("@/graphql/mutations");
      await graphqlClient.request(VERIFY_RESET_CODE_MUTATION, {
        email: step1Data.email,
        code: codeString,
      });
      alert("Code verified successfully! Password reset coming soon.");
      return true;
    } catch {
      setStep2Errors({ api: "Verification failed. Please try again." });
      return false;
    } finally {
      setIsPending(false);
    }
  }, [code, step1Data.email]);

  const handleResend = useCallback(async () => {
    try {
      setIsResending(true);
      const { graphqlClient } = await import("@/lib/graphql");
      const { RESEND_VERIFICATION_MUTATION } =
        await import("@/graphql/mutations");
      await graphqlClient.request(RESEND_VERIFICATION_MUTATION, {
        email: step1Data.email,
      });
    } catch {
      logger.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  }, [step1Data.email]);

  const handleGoBack = useCallback(() => {
    setStep(1);
  }, []);

  return {
    step,
    step1Data,
    step1Errors,
    step2Data: { code },
    step2Errors,
    isPending,
    isResending,
    onStep1Change: handleStep1Change,
    onStep1Submit: handleStep1Submit,
    onStep2Change: handleStep2Change,
    onStep2Submit: handleStep2Submit,
    onResend: handleResend,
    onGoBack: handleGoBack,
  };
};
