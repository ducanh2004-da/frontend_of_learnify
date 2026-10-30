import type { ReactNode } from "react";

export type TGraphqlErrorProps = {
  error?: unknown;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
};
