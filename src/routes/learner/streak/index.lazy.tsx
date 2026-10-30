import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextButton from "@/components/TextButton";
import Icon from "@/components/Icon";
import "./streak.scss";

export const Route = createLazyFileRoute("/learner/streak/")({
  component: StreakPage,
});

function StreakPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fireRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          fireRef.current,
          { scale: 0, rotation: -90 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        .fromTo(
          embersRef.current ? Array.from(embersRef.current.children) : [],
          { opacity: 0, scale: 0, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          "-=0.4"
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.15"
        )
        .fromTo(
          messageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.1"
        )
        .fromTo(
          btnRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.1"
        );

      gsap.to(glowRef.current, {
        scale: 1.08,
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });

      gsap.to(fireRef.current, {
        scale: 1.06,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });

      if (embersRef.current) {
        const embers = Array.from(embersRef.current.children);
        embers.forEach((ember) => {
          gsap.to(ember, {
            y: gsap.utils.random(-100, -160),
            x: gsap.utils.random(-30, 30),
            opacity: 0,
            duration: gsap.utils.random(1.2, 2),
            repeat: -1,
            delay: gsap.utils.random(0, 0.8),
            ease: "power1.out",
          });
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <div className="streak-page" ref={rootRef}>
      <div className="streak-page__glow" ref={glowRef} />

      <div className="streak-page__fire" ref={fireRef}>
        <Icon name="mode_heat" size={80} />
      </div>

      <div className="streak-page__embers" ref={embersRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="streak-page__ember" />
        ))}
      </div>

      <h1 className="streak-page__title" ref={titleRef}>
        {t("streak.title")}
      </h1>

      <div className="streak-page__content">
        <p className="streak-page__tagline" ref={taglineRef}>
          {t("streak.coming_soon")}
        </p>
        <p className="streak-page__message" ref={messageRef}>
          {t("streak.message")}
        </p>
      </div>

      <div ref={btnRef}>
        <TextButton
          icon="arrow_back"
          text={t("streak.back")}
          onClick={() => navigate({ to: "/learner/dashboard" })}
          size="medium"
          type="primary"
        />
      </div>
    </div>
  );
}
