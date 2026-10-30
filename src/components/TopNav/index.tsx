import "./style.scss";

import { useLayout } from "@/contexts/LayoutContext";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useRouterState } from "@tanstack/react-router";
import classnames from "classnames";
import { useCallback } from "react";
import TopNavLeft from "./components/TopNavLeft";
import TopNavRight from "./components/TopNavRight";
import usePathname from "./hooks/usePathname";

export type TTopNavProps = {
  className?: string;
  fullWidth?: boolean;
};

const TopNav = (props: TTopNavProps) => {
  const { className, fullWidth = false } = props;
  const pathnames = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { pathname, lastPathname, pathnameWithoutLast } = usePathname({
    pathnames,
  });
  const isTop = useScrollTop();
  const { customTitle, showSearch, setLayoutConfigState } = useLayout();

  const handleSearchClose = useCallback(() => {
    setLayoutConfigState((prev) => ({ ...prev, showSearch: false }));
  }, [setLayoutConfigState]);

  const navClassNames = classnames(
    "top-nav",
    { top: isTop && !fullWidth },
    fullWidth ? "full-width" : "",
    className
  );

  return (
    <nav className={navClassNames} data-lenis-prevent>
      <TopNavLeft
        fullWidth={fullWidth}
        pathname={pathname}
        lastPathname={lastPathname}
        pathnameWithoutLast={pathnameWithoutLast}
        customTitle={customTitle}
        showSearch={showSearch}
        onSearchClose={handleSearchClose}
      />
      <TopNavRight />
    </nav>
  );
};

export default TopNav;
