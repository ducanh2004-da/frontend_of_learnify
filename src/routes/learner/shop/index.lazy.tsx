import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextButton from "@/components/TextButton";
import Icon from "@/components/Icon";
import "./shop.scss";

export const Route = createLazyFileRoute("/learner/shop/")({
  component: ShopPage,
});

function ShopPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.6, scale: 1, duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          diamondRef.current,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        .fromTo(
          particlesRef.current ? Array.from(particlesRef.current.children) : [],
          { opacity: 0, scale: 0, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          "-=0.4"
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          messageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.15"
        )
        .fromTo(
          btnRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.1"
        );
    },
    { scope: rootRef }
  );

  return (
    <div className="shop-page" ref={rootRef}>
      <div className="shop-page__glow" ref={glowRef} />

      <div className="shop-page__diamond" ref={diamondRef}>
        <Icon name="diamond" size={80} />
      </div>

      <div className="shop-page__particles" ref={particlesRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Icon key={i} name="diamond" size={16} />
        ))}
      </div>

      <h1 className="shop-page__title" ref={titleRef}>
        {t("shop.title")}
      </h1>

      <div className="shop-page__content">
        <p className="shop-page__coming-soon" ref={messageRef}>
          {t("shop.coming_soon")}
        </p>
        <p className="shop-page__message">{t("shop.message")}</p>
      </div>

      <div ref={btnRef}>
        <TextButton
          icon="arrow_back"
          text={t("shop.back")}
          onClick={() => navigate({ to: "/learner/dashboard" })}
          size="medium"
          type="primary"
        />
      </div>
    </div>
  );
}
