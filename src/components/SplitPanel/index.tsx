import classnames from "classnames";
import {
  Children,
  isValidElement,
  useMemo,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import "./style.scss";

function SplitPanelRoot({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classnames("split-panel", className)} {...props}>
      {children}
    </div>
  );
}

function Tabs({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classnames("split-panel__tabs", className)} {...props}>
      {children}
    </div>
  );
}

function Tab({
  className,
  children,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={classnames(
        "split-panel__tab",
        { "split-panel__tab--active": active },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Content({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const hasSubList = useMemo(
    () =>
      Children.toArray(children).some(
        (child) => isValidElement(child) && child.type === SubList
      ),
    [children]
  );

  return (
    <div
      className={classnames(
        "split-panel__body",
        { "split-panel__body--3": hasSubList },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function List({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classnames("split-panel__list", className)}
      data-lenis-prevent
      {...props}
    >
      {children}
    </div>
  );
}

function Detail({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classnames(
        "split-panel__detail",
        "split-panel__detail--2",
        className
      )}
      data-lenis-prevent
      {...props}
    >
      {children}
    </div>
  );
}

function SubList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classnames(
        "split-panel__detail",
        "split-panel__detail--3",
        className
      )}
      data-lenis-prevent
      {...props}
    >
      {children}
    </div>
  );
}

function SubDetail({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classnames("split-panel__sub-detail", className)}
      data-lenis-prevent
      {...props}
    >
      {children}
    </div>
  );
}

SplitPanelRoot.Tabs = Tabs;
SplitPanelRoot.Tab = Tab;
SplitPanelRoot.Content = Content;
SplitPanelRoot.List = List;
SplitPanelRoot.Detail = Detail;
SplitPanelRoot.SubList = SubList;
SplitPanelRoot.SubDetail = SubDetail;

export default SplitPanelRoot;
