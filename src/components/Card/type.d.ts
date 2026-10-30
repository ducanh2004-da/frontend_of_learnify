import type { TSpecial } from "@/types/global";

export type TCourseCardProps = {
  className?: string;
  onClick: () => void;
  title: string;
  description?: string;
  duration?: number;
  typeSpecial?: TSpecial;
  disabled?: boolean;
  status?: TStatusCard;
  percentage?: number;
  badgeStatus?: "public" | "private";
};

export type TUseSpecialCardFooterProps = {
  status: "default" | "inProgress" | "completed" | "locked";
  percentage?: number;
  duration?: number;
  onClick?: () => void;
};
export type TUseDecorationCardFooterProps = {
  status: "default" | "inProgress" | "completed" | "locked";
  percentage?: number;
  star?: number;
  onClick?: () => void;
};
