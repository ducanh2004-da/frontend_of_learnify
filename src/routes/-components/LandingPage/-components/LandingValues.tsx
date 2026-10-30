import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "@/components/Icon";
import { Trans, useTranslation } from "react-i18next";

import "./LandingValues.scss";

interface ValueItem {
  key: string;
  icon: string;
  title: string;
  desc: string;
  iconColor: string;
}

interface LandingValuesProps {
  values: ValueItem[];
}

export default function LandingValues({ values }: LandingValuesProps) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useGSAP(
    () => {
      gsap.fromTo(
        ".landing-values__card",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "glide",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="landing-values">
      <div className="landing-section__inner">
        <h2 className="landing-section__title">
          <Trans
            i18nKey="landing.values.title"
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h2>
        <div className="landing-values__grid">
          {values.map((val) => (
            <div key={val.key} className="landing-values__card">
              <Icon
                name="diamond"
                size="1.5em"
                style={{ color: val.iconColor }}
              />
              <h5 className="semibold">
                {t(`about_us.values.${val.key}.title`, val.title)}
              </h5>
              <p className="regular">
                {t(`about_us.values.${val.key}.desc`, val.desc)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
