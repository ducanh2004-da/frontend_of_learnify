import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { graphqlClient } from "@/lib/graphql";
import { VERIFY_EMAIL_MUTATION } from "@/graphql/mutations";
import Icon from "@/components/Icon";

type VerifyEmailSearch = { token?: string; email?: string };

export const Route = createLazyFileRoute("/auth/verify-email/")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as VerifyEmailSearch;
  const token = search.token;
  const router = useRouter();

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

  useEffect(() => {
    if (!token) return;
    if (hasCalledAPI.current) return;
    hasCalledAPI.current = true;

    const verifyEmail = async () => {
      try {
        const response = await graphqlClient.request(VERIFY_EMAIL_MUTATION, {
          token,
        });

        if (response.verifyEmail.success) {
          setStatus("success");
          setMessage(
            response.verifyEmail.message || "Email verified successfully!"
          );

          await router.invalidate();
          await router.load();

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate({ to: "/learner/dashboard" });
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
              Redirecting to home in {countdown} seconds...
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
              onClick={() => navigate({ to: "/auth/log-in" })}
            >
              <h6 className="semibold">Back to Log In</h6>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
