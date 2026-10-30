import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon, { type TIconName } from "@/components/Icon";
import { Trans, useTranslation } from "react-i18next";

import "./LandingHow.scss";

interface HowItWorksStep {
  step: string;
  icon: TIconName;
  key: string;
}

interface LandingHowProps {
  steps: HowItWorksStep[];
}

export default function LandingHow({ steps }: LandingHowProps) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useGSAP(
    () => {
      gsap.fromTo(
        ".landing-how__step",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "glide",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="landing-how">
      <div className="landing-section__inner">
        <h2 className="landing-section__title">
          <Trans
            i18nKey="landing.how.title"
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h2>
        <div className="landing-how__grid">
          {steps.map((item) => (
            <div key={item.step} className="landing-how__step">
              <span className="landing-how__step-number">{item.step}</span>
              <div className="landing-how__step-icon">
                <Icon name={item.icon} size="2em" />
              </div>
              <h4 className="semibold">
                {t(`landing.how.steps.${item.key}.title`)}
              </h4>
              <p className="regular">
                {t(`landing.how.steps.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
