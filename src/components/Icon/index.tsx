import classnames from "classnames";
import type { TIconProps } from "./type";
import { iconPaths } from "./icons";
import "./style.scss";

export type { TIconName } from "./icons";

const Icon = (props: TIconProps) => {
  const { name, fill = false, size = "1em", className, style } = props;

  const icon = iconPaths[name];
  if (!icon) return null;

  const pxSize = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      className={classnames("icon", className)}
      viewBox="0 -960 960 960"
      width={pxSize}
      height={pxSize}
      fill="currentColor"
      aria-hidden="true"
      style={style}
    >
      <path d={fill ? icon.fill : icon.regular} />
    </svg>
  );
};

export default Icon;
