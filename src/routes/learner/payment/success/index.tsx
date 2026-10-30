import "./style.scss";

import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { useGetPayment, useUpdatePaymentStatus } from "@/hooks/usePayment";
import { useEnrollCourse } from "@/hooks/useCourseDetail";
import { useAuthStore } from "@/store/authStore";

import Icon from "@/components/Icon";

const payosSearchSchema = z.object({
  code: z.union([z.string(), z.number()]).transform(String).catch(""),
  id: z.union([z.string(), z.number()]).transform(String).catch(""),
  cancel: z
    .union([z.string(), z.boolean()])
    .transform((val) => String(val) === "true")
    .catch(false),
  status: z.string().catch(""),
  orderCode: z.union([z.string(), z.number()]).transform(String).catch(""),
});

export const Route = createFileRoute("/learner/payment/success/")({
  validateSearch: (search) => payosSearchSchema.parse(search),
  component: PaymentSuccessComponent,
});

function PaymentSuccessComponent() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const updatePaymentStatusMutation = useUpdatePaymentStatus();
  const enrollCourseMutation = useEnrollCourse();
  const currentUser = useAuthStore((state) => state.user);
  const { data: paymentData } = useGetPayment(searchParams.id);
  const processedRef = useRef(false);

  useEffect(() => {
    if (!searchParams.orderCode || !searchParams.status || !searchParams.id)
      return;
    if (processedRef.current) return;
    processedRef.current = true;

    let finalStatus = "PENDING";
    if (searchParams.status === "PAID") finalStatus = "COMPLETED";
    if (searchParams.status === "CANCELLED" || searchParams.cancel)
      finalStatus = "CANCELLED";

    updatePaymentStatusMutation.mutate(
      { orderCode: searchParams.orderCode, status: finalStatus },
      {
        onSuccess: async (data) => {
          if (data?.isSuccess) {
            toast.success(data.message || t("payment.success_title"));

            if (finalStatus === "COMPLETED" && currentUser?.id) {
              try {
                const courseId = paymentData?.courseId;
                if (courseId) {
                  await enrollCourseMutation.mutateAsync({
                    courseId,
                  });
                  toast.success(t("payment.success_desc"));
                }
              } catch (error) {
                console.error("Enrollment error:", error);
              }
            }
          }
        },
        onError: (err) => {
          toast.error(t("course_detail.payment_error"));
          console.error(err);
        },
        onSettled: async () => {
          await queryClient.invalidateQueries();
          await router.invalidate();
        },
      }
    );
  }, [
    searchParams.orderCode,
    searchParams.status,
    searchParams.cancel,
    searchParams.id,
    updatePaymentStatusMutation,
    enrollCourseMutation,
    currentUser?.id,
    paymentData?.courseId,
    queryClient,
    router,
    t,
  ]);

  const isLoading =
    updatePaymentStatusMutation.isPending || enrollCourseMutation.isPending;
  const isSuccess = searchParams.status === "PAID" && !searchParams.cancel;

  const handleStartLearning = useCallback(
    () => navigate({ to: "/learner/courses", search: { q: "" } }),
    [navigate]
  );

  const handleGoHome = useCallback(() => navigate({ to: "/" }), [navigate]);

  return (
    <div className="payment-success">
      <div className="payment-success__card">
        {isLoading ? (
          <>
            <div
              className={classnames(
                "payment-success__icon",
                "payment-success__icon--loading"
              )}
            >
              <div className="payment-success__loader" />
            </div>
            <h2 className="payment-success__title">
              {t("payment.processing_title")}
            </h2>
            <p className="payment-success__desc">
              {t("payment.processing_desc")}
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div
              className={classnames(
                "payment-success__icon",
                "payment-success__icon--success"
              )}
            >
              <Icon name="check_circle" />
            </div>
            <h2 className="payment-success__title">
              {t("payment.success_title")}
            </h2>
            <p className="payment-success__desc">
              {t("payment.success_order_label")}
              <span className="payment-success__desc-highlight">
                {searchParams.orderCode}
              </span>
            </p>
            <div className="payment-success__actions">
              <button
                onClick={handleStartLearning}
                className={classnames(
                  "payment-success__btn",
                  "payment-success__btn--primary"
                )}
              >
                {t("payment.success_cta")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={classnames(
                "payment-success__icon",
                "payment-success__icon--error"
              )}
            >
              <Icon name="cancel" />
            </div>
            <h2 className="payment-success__title">
              {t("payment.cancel_title")}
            </h2>
            <p className="payment-success__desc">{t("payment.cancel_desc")}</p>
            <div className="payment-success__actions">
              <button
                onClick={handleGoHome}
                className={classnames(
                  "payment-success__btn",
                  "payment-success__btn--outline"
                )}
              >
                {t("payment.cancel_go_home")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
