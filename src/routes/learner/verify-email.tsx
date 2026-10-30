import "../auth/verify-email/verify-email.scss";

import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

import Icon from "@/components/Icon";
import { VERIFY_EMAIL_MUTATION } from "@/graphql/mutations";
import { graphqlClient } from "@/lib/graphql";

const verifyEmailSearchSchema = z.object({
  token: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
});

export type TVerifyEmailSearch = z.infer<typeof verifyEmailSearchSchema>;

type TVerifyEmailMutationResponse = {
  verifyEmail: {
    success: boolean;
    message?: string | null;
  };
};

export const Route = createFileRoute("/learner/verify-email")({
  validateSearch: (search): TVerifyEmailSearch =>
    verifyEmailSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Verify Email - Learnify" }],
  }),
  component: LearnerVerifyEmailPage,
});

function LearnerVerifyEmailPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { token } = Route.useSearch();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token
      ? "Verifying your account..."
      : "No valid verification token found in the link."
  );
  const [countdown, setCountdown] = useState(3);
  const hasCalledAPI = useRef(false);

  const handleBackToLogin = useCallback(() => {
    navigate({ to: "/auth/log-in" });
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    if (hasCalledAPI.current) return;
    hasCalledAPI.current = true;

    let countdownTimer: ReturnType<typeof setInterval> | null = null;

    const verifyEmail = async () => {
      try {
        const response =
          await graphqlClient.request<TVerifyEmailMutationResponse>(
            VERIFY_EMAIL_MUTATION,
            { token }
          );

        if (response.verifyEmail.success) {
          setStatus("success");
          setMessage(
            response.verifyEmail.message || "Email verified successfully!"
          );

          await router.invalidate();
          await router.load();

          countdownTimer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (countdownTimer) clearInterval(countdownTimer);
                navigate({ to: "/auth/log-in" });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus("error");
          setMessage(response.verifyEmail.message || "Verification failed.");
        }
      } catch (error: unknown) {
        setStatus("error");
        const maybeGraphQLError = error as {
          response?: { errors?: Array<{ message?: string }> };
        };
        const errorMessage =
          maybeGraphQLError?.response?.errors?.[0]?.message ||
          "Verification failed due to a system error. Please try again.";
        setMessage(errorMessage);
      }
    };

    verifyEmail();

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [token, navigate, router]);

  return (
    <div className="verify-email" id="verify-email-page">
      <div className="verify-email__container">
        {status === "loading" && (
          <div className="verify-email__loading">
            <div className="verify-email__spinner" />
            <h3 className="semibold">{message}</h3>
          </div>
        )}
        {status === "success" && (
          <div className="verify-email__success">
            <Icon name="check_circle" />
            <h3 className="semibold">{message}</h3>
            <p className="regular">
              Redirecting to log in in {countdown} seconds...
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="verify-email__error">
            <Icon name="error" />
            <h3 className="semibold">Verification Failed</h3>
            <p className="regular">{message}</p>
            <button
              className="verify-email__retry-btn"
              type="button"
              onClick={handleBackToLogin}
            >
              <h6 className="semibold">Back to Log In</h6>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
