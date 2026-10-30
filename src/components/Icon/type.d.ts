import type { CSSProperties } from "react";
import type { TIconName } from "./icons";

export type TIconProps = {
  name: TIconName;
  fill?: boolean;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
};
