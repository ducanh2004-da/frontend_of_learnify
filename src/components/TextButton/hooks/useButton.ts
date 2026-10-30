import { useTranslation } from "react-i18next";
import type {
  TRoundedCorner,
  TSize,
  TSpecial,
  TType,
  TTypeSecondary,
} from "@/types/global";
import classNames from "classnames";

export type TUseButtonProps = {
  type: TType;
  roundedCorner: TRoundedCorner;
  size: TSize;
  typeSecondary: TTypeSecondary;
  shape: "circular";
  typeSpecial: TSpecial;
  text: string;
  tooltip: string;
  disabled: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
};

export const useButton = (props: TUseButtonProps) => {
  const {
    type,
    roundedCorner,
    size,
    typeSecondary,
    shape,
    typeSpecial,
    text,
    tooltip,
    disabled,
    loading = false,
    onClick,
    className,
  } = props;

  const onClickHandler = () => {
    if (disabled || loading) return;
    onClick();
  };

  const buttonClassNames = classNames(
    "text-button",
    className,
    type,
    [`corner-${roundedCorner}`],
    size,
    { [`typeSecondary-${typeSecondary}`]: type === "secondary" },
    shape,
    { [`typeSpecial-${typeSpecial}`]: type === "special" },
    { disabled: disabled || loading },
    { loading: loading }
  );

  const { t } = useTranslation();

  const iconLabel = type === "special" ? t(`special.${typeSpecial}`) : text;

  const toolTipContent =
    type === "special" ? t(`special_tooltip.${typeSpecial}`) : tooltip;

  return {
    onClickHandler,
    buttonClassNames,
    iconLabel,
    toolTipContent,
  };
};
