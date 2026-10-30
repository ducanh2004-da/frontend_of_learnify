import Icon, { type TIconName } from "@/components/Icon";
import TextButton from "@/components/TextButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";

import "./LandingAudience.scss";

interface Audience {
  icon: TIconName;
  key: string;
  to: string;
}

interface LandingAudienceProps {
  audiences: Audience[];
}

export default function LandingAudience({ audiences }: LandingAudienceProps) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useGSAP(
    () => {
      gsap.fromTo(
        ".landing-audience__card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "glide",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="landing-audience">
      <div className="landing-section__inner">
        <h2 className="landing-section__title">
          <Trans
            i18nKey="landing.audience.title"
            components={{ Beauty: <span className="beauty" /> }}
          />
        </h2>
        <div className="landing-audience__grid">
          {audiences.map((aud) => (
            <div key={aud.key} className="landing-audience__card">
              <Icon name={aud.icon} className="landing-audience__icon" />
              <h3 className="semibold">
                {t(`landing.audience.${aud.key}.title`)}
              </h3>
              <p className="regular">{t(`landing.audience.${aud.key}.desc`)}</p>
              <TextButton
                text={t(`landing.audience.${aud.key}.cta`)}
                size="small"
                icon="arrow_forward"
                onClick={() => navigate({ to: aud.to })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
