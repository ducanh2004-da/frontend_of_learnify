import { useState, useCallback } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useLogin } from "@/hooks/useLogin";
import { setSessionFn } from "@/server/auth";
import { fetchCurrentUser } from "@/apis/auth";
import { normalizeRole, getRoleDefaultRoute } from "@/utils/role";
import z from "zod";
import { logger } from "@/utils/logger";

export type TLogInForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type TFormErrors = Record<string, string>;

export const logInFormSchema = z.object({
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const useLogInForm = (props: { redirect?: string }) => {
  const { redirect } = props;
  const navigate = useNavigate();
  const router = useRouter();
  const login = useLogin();

  const [formData, setFormData] = useState<TLogInForm>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<TFormErrors>({});

  const handleChange = useCallback(
    (field: keyof TLogInForm, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    },
    []
  );

  const handleSubmit = async () => {
    try {
      const parseResult = logInFormSchema.safeParse(formData);
      if (!parseResult.success) {
        const validationErrors: TFormErrors = {};
        parseResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            validationErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(validationErrors);
        return false;
      }

      const result = await login.mutateAsync({
        data: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (result.success) {
        const userData = await fetchCurrentUser();
        if (userData)
          await setSessionFn({
            data: {
              id: userData.id,
              email: userData.email,
              username: userData.username,
              role: normalizeRole(userData.role),
              diamond: userData.diamond,
              currentSteak: userData.currentSteak,
            },
          });
        await router.invalidate();
        await router.load();
        if (redirect) {
          navigate({ to: redirect });
        } else {
          const role = normalizeRole(userData?.role);
          navigate({ to: getRoleDefaultRoute(role) });
        }
      } else {
        setErrors({
          api: result.message || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      logger.error("Login error:", error);
      setErrors({
        api: "An error occurred. Please check your credentials and try again.",
      });
    }
  };

  return {
    data: formData,
    errors,
    isPending: login.isPending,
    onChange: handleChange,
    onSubmit: handleSubmit,
  };
};
