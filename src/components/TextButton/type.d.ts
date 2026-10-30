import type { TIconName } from "@/components/Icon";
import type {
  TType,
  TRoundedCorner,
  TSize,
  TTypeSecondary,
  TSpecial,
} from "@/types/global";

export type TTextButtonProps = {
  icon?: TIconName;
  onClick: () => void | Promise<void>;
  leftIcon?: boolean;
  rightIcon?: boolean;
  text: string;
  type?: TType;
  roundedCorner?: TRoundedCorner;
  size?: TSize;
  typeSecondary?: TTypeSecondary;
  shape?: "circular";
  typeSpecial?: TSpecial;
  backgroundColor?: string;
  color?: string;
  tooltip?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  loading?: boolean;
};

export type TIconProps = {
  visible: boolean;
  type: TType;
  typeSpecial?: TSpecial;
  icon?: TIconName;
  color?: string;
};
