import LeftNavTop from "./components/LeftNavTop";
import LeftNavBot from "./components/LeftNavBot";
import Controller from "./components/Controller";
import classnames from "classnames";
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useIsMobile } from "@/hooks/useIsMobile";
import "./style.scss";

type TLeftNavProps = {
  className?: string;
};

const LeftNav = (props: TLeftNavProps) => {
  const { className } = props;
  const isMobile = useIsMobile();
  const [toggled, setToggled] = useState(false);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isTop = useScrollTop();

  const active = isMobile ? toggled : true;
  const navClassNames = classnames(
    "left-nav",
    { active, top: isTop },
    className
  );

  const handleToggle = () => setToggled((c) => !c);
  const handleOverlayClick = () => setToggled(false);

  return (
    <>
      {active && isMobile && (
        <div
          className="left-nav__overlay"
          onClick={handleOverlayClick}
          data-lenis-prevent
        />
      )}
      <nav className={navClassNames} data-lenis-prevent>
        <LeftNavTop pathname={pathname} />
        <LeftNavBot />
        <Controller active={active} onClick={handleToggle} />
      </nav>
    </>
  );
};

export default LeftNav;
