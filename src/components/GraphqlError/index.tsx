import "./style.scss";

import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import ErrorScene from "@/components/ErrorScene";
import Icon, { type TIconName } from "@/components/Icon";
import TextButton from "@/components/TextButton";

import type { TGraphqlErrorProps } from "./type";

type GraphQLErrorItem = {
  message: string;
  extensions?: { code?: string };
};

type GraphQLErrorResponse = {
  errors?: GraphQLErrorItem[];
};

const ERROR_CONFIG: Record<
  string,
  { localeKey: string; adviceKey: string; icon: TIconName }
> = {
  ThrottlerException: {
    localeKey: "errors.throttler_title",
    adviceKey: "errors.throttler_advice",
    icon: "close",
  },
  ValidationException: {
    localeKey: "errors.validation_title",
    adviceKey: "errors.validation_advice",
    icon: "error",
  },
  NotFoundException: {
    localeKey: "errors.not_found_title",
    adviceKey: "errors.not_found_advice",
    icon: "search",
  },
  ForbiddenException: {
    localeKey: "errors.forbidden_title",
    adviceKey: "errors.forbidden_advice",
    icon: "lock",
  },
  BadRequestException: {
    localeKey: "errors.bad_request_title",
    adviceKey: "errors.bad_request_advice",
    icon: "info",
  },
  InternalServerError: {
    localeKey: "errors.server_error",
    adviceKey: "errors.server_advice",
    icon: "error",
  },
};

function parseGraphQLError(
  error: unknown
): { message: string; code: string } | null {
  if (!error || typeof error !== "object") return null;

  const err = error as Record<string, unknown>;

  if (
    "response" in err &&
    typeof err.response === "object" &&
    err.response !== null
  ) {
    const response = err.response as GraphQLErrorResponse;
    const item = response.errors?.[0];
    if (item?.extensions?.code) {
      return { message: item.message, code: item.extensions.code };
    }
    if (item?.message) {
      return { message: item.message, code: "Unknown" };
    }
  }

  if ("errors" in err) {
    const resp = err as GraphQLErrorResponse;
    const item = resp.errors?.[0];
    if (item?.extensions?.code) {
      return { message: item.message, code: item.extensions.code };
    }
    if (item?.message) {
      return { message: item.message, code: "Unknown" };
    }
  }

  if (err instanceof Error) {
    return { message: err.message, code: "Unknown" };
  }

  return null;
}

const FALLBACK_ICON = "error";

function GraphqlError({
  error,
  title,
  description,
  className,
}: TGraphqlErrorProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const parsed = error ? parseGraphQLError(error) : null;
  const config = parsed ? ERROR_CONFIG[parsed.code] : null;

  const displayTitle =
    title ?? (config ? t(config.localeKey) : t("errors.server_error"));

  const errorCode = parsed?.code ?? "Error";

  const displayDescription =
    description ??
    (config
      ? t(config.adviceKey)
      : parsed
        ? parsed.message
        : t("errors.load_generic"));

  const iconName = config?.icon ?? FALLBACK_ICON;

  return (
    <div
      data-slot="graphql-error"
      className={classnames("graphql-error", className)}
    >
      <span
        className={classnames(
          "graphql-error__icon",
          `graphql-error__icon--${errorCode.toLowerCase()}`
        )}
      >
        <Icon name={iconName} size={72} />
      </span>

      <ErrorScene>
        <ErrorScene.Header>
          <ErrorScene.Title errorCode={errorCode}>
            {displayTitle}
          </ErrorScene.Title>
          <ErrorScene.Description>{displayDescription}</ErrorScene.Description>
        </ErrorScene.Header>
        <ErrorScene.Content>
          <div className="error-scene__control">
            <TextButton
              text={t("errors.try_again")}
              onClick={() => router.invalidate()}
              className="error-scene__btn"
              size="medium"
              icon="refresh"
            />
            <TextButton
              text={t("errors.go_back")}
              onClick={() => window.history.back()}
              className="error-scene__btn error-scene__btn--secondary"
              size="medium"
              icon="arrow_back"
              type="outlined"
            />
          </div>
        </ErrorScene.Content>
      </ErrorScene>
    </div>
  );
}

export default GraphqlError;
