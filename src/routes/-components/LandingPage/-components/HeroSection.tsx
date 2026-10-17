import "./HeroSection.scss";

import TextButton from "@/components/TextButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onLearnerClick: () => void;
  onTeacherClick: () => void;
}

export default function HeroSection({
  onLearnerClick,
  onTeacherClick,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "hop" } });
      const split = new SplitText(".landing-hero__headline", {
        type: "lines",
      });
      tl.fromTo(
        split.lines,
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        0
      );
      tl.fromTo(
        ".landing-hero__subtitle",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.3
      );
      tl.fromTo(
        ".landing-hero__cta .text-button",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08 },
        0.5
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="landing-hero">
      <div className="landing-hero__content">
        <h1 className="landing-hero__headline">
          <span>{t("landing.hero.headline_line1")}</span>
          <span className="beauty">{t("landing.hero.headline_line2")}</span>
          <span>{t("landing.hero.headline_line3")}</span>
        </h1>
        <p className="landing-hero__subtitle regular">
          {t("landing.hero.subtitle")}
        </p>
        <div className="landing-hero__cta">
          <TextButton
            text={t("landing.hero.learner_cta")}
            size="large"
            icon="school"
            onClick={onLearnerClick}
          />
          <TextButton
            text={t("landing.hero.instructor_cta")}
            size="large"
            type="outlined"
            icon="local_library"
            onClick={onTeacherClick}
          />
        </div>
      </div>
    </section>
  );
}
