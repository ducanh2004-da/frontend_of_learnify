import { OptimizeImage } from "@/components/Images";
import PillTopNav from "@/components/PillTopNav";
import { ABOUT_STATS } from "@/mock";
import AboutStat from "@learner/about/-components/AboutStat";
import MemberItem from "@learner/about/-components/MemberItem";
import { teamMembers } from "@/mock";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAboutAnimations } from "./-hooks/useAboutAnimations";

export const Route = createLazyFileRoute("/about-us/")({
  component: AboutUs,
});

function AboutUs() {
  const { t } = useTranslation();
  const { headRef, heroRef, directionRef, statsRef, visionRef, teamRef } =
    useAboutAnimations();

  return (
    <div className="about-us">
      <PillTopNav />
      <main className="about-us__content">
        <section className="about-us__head" ref={headRef}>
          <div className="about-us__head-content">
            <h1 className="about-us__head-title">{t("about.page_title")}</h1>
            <h3 className="about-us__head-tagline">{t("about.tagline")}</h3>
          </div>
        </section>

        <section className="about-us__story" ref={heroRef}>
          <div className="about-us__story-content">
            <p>{t("about.hero_paragraph_1")}</p>
            <p>{t("about.hero_paragraph_2")}</p>
            <p>{t("about.hero_paragraph_3")}</p>
          </div>
          <div className="about-us__story-image">
            <OptimizeImage
              priority
              src="/footer.webp"
              alt={t("about.hero_alt")}
            />
          </div>
        </section>

        <hr className="about-us__divider" />

        <section className="about-us__direction" ref={directionRef}>
          <div className="about-us__direction-heading">
            <h3>{t("about.direction_title")}</h3>
            <h3 className="about-us__direction-subtitle">
              {t("about.direction_subtitle")}
            </h3>
          </div>
          <h4 className="about-us__direction-text">
            {t("about.direction_text")}
          </h4>
        </section>

        <section className="about-us__stats" ref={statsRef}>
          {ABOUT_STATS.map((stat, index) => (
            <AboutStat
              key={`stat-${index}`}
              index={index + 1}
              color={stat.color}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </section>

        <hr className="about-us__divider" />

        <section className="about-us__vision" ref={visionRef}>
          <h3 className="about-us__vision-heading">
            {t("about.vision_heading")}
          </h3>
          <h4 className="about-us__vision-text">{t("about.vision_text")}</h4>
        </section>

        <hr className="about-us__divider" />

        <section className="about-us__team" ref={teamRef}>
          <h3 className="about-us__team-heading">{t("about.team_heading")}</h3>
          <h4 className="about-us__team-subtitle">
            {t("about.team_subtitle")}
          </h4>
          <div className="about-us__team-grid">
            {teamMembers.map((member, index) => (
              <MemberItem key={`team-${index}`} {...member} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
