import classnames from "classnames";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useNavigate } from "@tanstack/react-router";
import type { TChromaGridProps } from "./type";
import "./style.scss";

const ChromaGrid = (props: TChromaGridProps) => {
  const {
    items = [],
    className,
    radius = 300,
    damping = 20,
    fadeOut = 500,
    ease = "power3.out",
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    const reveal = revealRef.current;
    if (!root || !reveal) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      gsap.to(root, {
        "--x": `${e.clientX - rect.left}px`,
        "--y": `${e.clientY - rect.top}px`,
        duration: damping / 1000,
        ease,
        overwrite: "auto",
      });

      gsap.killTweensOf(reveal);
      gsap.to(reveal, {
        opacity: 0,
        duration: damping / 1000,
        delay: fadeOut / 1000,
        ease,
        overwrite: "auto",
      });
    };

    const handlePointerLeave = () => {
      gsap.killTweensOf(reveal);
      gsap.to(reveal, {
        opacity: 1,
        duration: damping / 1000,
        ease,
        overwrite: "auto",
      });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf(root);
      gsap.killTweensOf(reveal);
    };
  }, [damping, fadeOut, ease]);

  const handleCardClick = useCallback(
    (url?: string) => {
      if (!url) return;
      if (url.startsWith("http")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        navigate({ to: url });
      }
    },
    [navigate]
  );

  return (
    <div
      ref={rootRef}
      className={classnames("chroma-grid", className)}
      style={{ "--r": `${radius}px` } as React.CSSProperties}
    >
      {items.map((item, i) => (
        <article
          key={i}
          className="chroma-grid__card"
          style={
            {
              "--card-border": item.borderColor,
              background: item.gradient,
            } as React.CSSProperties
          }
          onClick={() => handleCardClick(item.url)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && item.url) {
              e.preventDefault();
              handleCardClick(item.url);
            }
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--mouse-x",
              `${e.clientX - rect.left}px`
            );
            e.currentTarget.style.setProperty(
              "--mouse-y",
              `${e.clientY - rect.top}px`
            );
          }}
          tabIndex={0}
          role="button"
        >
          <div className="chroma-grid__card-spotlight" />
          <div className="chroma-grid__card-image-wrapper">{item.image}</div>
          <footer className="chroma-grid__card-footer">
            <h4 className="chroma-grid__card-title">{item.title}</h4>
            {item.handle && (
              <span className="chroma-grid__card-handle">{item.handle}</span>
            )}
            <p className="chroma-grid__card-subtitle">{item.subtitle}</p>
          </footer>
        </article>
      ))}
      <div ref={overlayRef} className="chroma-grid__overlay" />
      <div ref={revealRef} className="chroma-grid__reveal" />
    </div>
  );
};

export default ChromaGrid;
