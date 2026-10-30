import classnames from "classnames";
import type { CSSProperties, ReactNode } from "react";

type TRouterComponentHolder = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function RouterComponentHolder(props: TRouterComponentHolder) {
  return (
    <div
      className={classnames("learner-loader", props.className)}
      style={{
        marginTop: "-50px",
        height: "100%",
        width: "100%",
        minHeight: "70dvh",
        minWidth: "80dvw",
        maxHeight: "100dvh",
        maxWidth: "100dvw",
        display: "flex",
        placeContent: "center",
        placeItems: "center",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

export default RouterComponentHolder;
