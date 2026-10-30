import classNames from "classnames";
import type { CSSProperties } from "react";
import "./style.scss";

type TSubscriptionButtonProps = {
  text: string;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
};

const SubscriptionButton = (props: TSubscriptionButtonProps) => (
  <button
    className={classNames(
      "subscription-button",
      { disabled: props.disabled },
      props.className
    )}
    style={props.style}
  >
    <p className="subscription-button__text medium">{props.text}</p>
  </button>
);

export default SubscriptionButton;
