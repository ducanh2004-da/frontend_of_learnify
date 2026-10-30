import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { OptimizeImage } from "@/components/Images";
import { Slanted } from "@/components/Shapes";
import { ABOUT_STATS } from "@/mock";
import AboutStat from "@learner/about/-components/AboutStat/index";
import TeamList from "@learner/about/-components/TeamList";
import { COLORS } from "@/styles/colors";
import "./style.scss";

export const Route = createFileRoute("/learner/about/")({
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <section className="about-page__head">
        <div className="about-page__head-content">
          <h1 className="about-page__head-title">{t("about.page_title")}</h1>
          <h2 className="about-page__head-tagline">{t("about.tagline")}</h2>
        </div>
        <Slanted color={COLORS.greenPastel200} size="15vw" />
      </section>

      <section className="about-page__hero">
        <div className="about-page__hero-content">
          <p className="about-page__hero-text">{t("about.hero_paragraph_1")}</p>
          <p className="about-page__hero-text">{t("about.hero_paragraph_2")}</p>
          <p className="about-page__hero-text">{t("about.hero_paragraph_3")}</p>
        </div>

        <OptimizeImage priority src="/footer.webp" alt={t("about.hero_alt")} />
      </section>

      <hr className="about-page__divider" />

      <section className="about-page__direction">
        <div className="about-page__direction-heading">
          <h3 className="about-page__direction-title">
            {t("about.direction_title")}
          </h3>
          <h3 className="about-page__direction-subtitle">
            {t("about.direction_subtitle")}
          </h3>
        </div>
        <h4 className="about-page__direction-text">
          {t("about.direction_text")}
        </h4>
      </section>

      <section className="about-page__stats">
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

      <hr className="about-page__divider" />

      <section className="about-page__vision">
        <h3 className="about-page__vision-heading">
          {t("about.vision_heading")}
        </h3>
        <h4 className="about-page__vision-text">{t("about.vision_text")}</h4>
      </section>

      <hr className="about-page__divider" />

      <section className="about-page__team">
        <h3 className="about-page__team-heading">{t("about.team_heading")}</h3>
        <h4 className="about-page__team-subtitle">
          {t("about.team_subtitle")}
        </h4>
      </section>

      <TeamList />
    </div>
  );
}
