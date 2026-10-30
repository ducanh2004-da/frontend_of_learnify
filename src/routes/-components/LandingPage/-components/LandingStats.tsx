import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AboutStat from "@learner/about/-components/AboutStat";
import type { TAboutStatProps, TLabel } from "@learner/about/-types/about";
import { Trans, useTranslation } from "react-i18next";

import "./LandingStats.scss";

type TLandingStat = Omit<TAboutStatProps, "index"> & { key: string };

interface LandingStatsProps {
  stats: TLandingStat[];
}

export default function LandingStats({ stats }: LandingStatsProps) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useGSAP(
    () => {
      gsap.fromTo(
        ".landing-stat",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "glide",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="landing-stats">
      <div className="landing-section__inner">
        <h2 className="landing-section__title">
          <Trans
            i18nKey="landing.stats.title"
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h2>
        <div className="landing-stats__grid">
          {stats.map((stat, index) => (
            <div key={`stat-${index}`} className="landing-stat">
              <AboutStat
                index={index + 1}
                color={stat.color}
                label={
                  t(`about_us.stats.${stat.key}.label`, stat.label) as TLabel
                }
                value={stat.value}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
