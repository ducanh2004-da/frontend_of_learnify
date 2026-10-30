import "./style.scss";

import classnames from "classnames";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/components/Icon";

type TStaggeredMenuItem = {
  label: string;
  link: string;
};

type TStaggeredMenuProps = {
  onClose: () => void;
  items: TStaggeredMenuItem[];
  className?: string;
};

const StaggeredMenu = ({ onClose, items, className }: TStaggeredMenuProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const prelayers = container.querySelectorAll<HTMLElement>(
        ".staggered-menu__prelayer"
      );
      const panel = container.querySelector<HTMLElement>(
        ".staggered-menu__panel"
      );
      const itemLabels = container.querySelectorAll<HTMLElement>(
        ".staggered-menu__item-label"
      );
      const overlay = container.querySelector<HTMLElement>(
        ".staggered-menu__overlay"
      );
      const closeBtn = container.querySelector<HTMLElement>(
        ".staggered-menu__close"
      );

      if (!panel || !overlay) return;

      gsap.set(prelayers, { xPercent: 100 });
      gsap.set(panel, { xPercent: 100 });
      gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(closeBtn, { opacity: 0 });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });

      const prelayerArr = Array.from(prelayers);
      prelayerArr.forEach((layer, i) => {
        tl.to(
          layer,
          { xPercent: 0, duration: 0.5, ease: "power4.out" },
          i * 0.07
        );
      });

      const panelTime = (prelayerArr.length - 1) * 0.07 + 0.08;
      tl.to(
        panel,
        { xPercent: 0, duration: 0.65, ease: "power4.out" },
        panelTime
      );

      tl.to(
        closeBtn,
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        panelTime + 0.2
      );

      const itemsTime = panelTime + 0.65 * 0.15;
      tl.to(
        itemLabels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsTime
      );
    });

    return () => ctx.revert();
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    const container = containerRef.current;
    if (!container) return;

    const prelayers = container.querySelectorAll<HTMLElement>(
      ".staggered-menu__prelayer"
    );
    const panel = container.querySelector<HTMLElement>(
      ".staggered-menu__panel"
    );
    const overlay = container.querySelector<HTMLElement>(
      ".staggered-menu__overlay"
    );

    if (!panel) return;

    tlRef.current?.kill();

    const allSliding = [...Array.from(prelayers), panel];

    gsap.to(allSliding, {
      xPercent: 100,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
    });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        onClose();
      },
    });
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleItemClick = useCallback(
    (link: string) => {
      handleClose();
      navigate({ to: link });
    },
    [navigate, handleClose]
  );

  return (
    <div
      ref={containerRef}
      className={classnames("staggered-menu", className)}
      data-lenis-prevent
    >
      <div
        className="staggered-menu__overlay"
        onClick={handleClose}
        role="presentation"
      />
      <div className="staggered-menu__prelayers" aria-hidden="true">
        <div className="staggered-menu__prelayer staggered-menu__prelayer--navy" />
        <div className="staggered-menu__prelayer staggered-menu__prelayer--green" />
        <div className="staggered-menu__prelayer staggered-menu__prelayer--salmon" />
      </div>
      <div className="staggered-menu__panel">
        <button
          className="staggered-menu__close"
          onClick={handleClose}
          aria-label="Close menu"
          type="button"
        >
          <Icon name="close" size="1.5em" />
        </button>
        <ul className="staggered-menu__list">
          {items.map((item, i) => (
            <li key={i} className="staggered-menu__item">
              <button
                className="staggered-menu__link"
                onClick={() => handleItemClick(item.link)}
                type="button"
              >
                <span className="staggered-menu__item-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StaggeredMenu;
