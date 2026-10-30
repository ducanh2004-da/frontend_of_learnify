import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import IconButton from "@/components/IconButton";
import { OptimizeImage } from "@/components/Images";
import "./style.scss";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <OptimizeImage
        className="footer-banner"
        src="/footer.webp"
        alt={t("footer.banner_alt")}
        priority
      />
      <div className="footer-content">
        <div className="item item-1">
          <h2 className="bold">{t("footer.brand")}</h2>
          <p>
            {t("footer.made_by")}{" "}
            <a href="https://tanstack.com/start/latest">
              {t("footer.tanstack_link")}
            </a>
          </p>
        </div>
        <div className="item item-2">
          <div className="navigation">
            <p className="footer-section-label">{t("footer.navigation")}</p>
            <div className="navigation-context">
              <Link to="/learner/courses" search={{ q: "" }}>
                {t("footer.courses")}
              </Link>
              <Link to="/learner/roadmaps" search={{ q: "" }}>
                {t("footer.roadmaps")}
              </Link>
              <Link to="/learner/friends">{t("footer.friends")}</Link>
              <Link to="/learner/about">{t("footer.about")}</Link>
            </div>
          </div>
          <p>{t("footer.copyright", { year: currentYear })}</p>
        </div>
        <div className="item item-3">
          <div className="socials">
            <p className="footer-section-label">{t("footer.socials")}</p>
            <div className="socials-context">
              <a href="/">{t("footer.ig")}</a>
              <a href="/">{t("footer.dr")}</a>
              <a href="/">{t("footer.fb")}</a>
              <a href="/">{t("footer.x")}</a>
            </div>
          </div>
          <a href="/">{t("footer.privacy_policy")}</a>
        </div>
        <IconButton
          icon="arrow_upward"
          specialIcon="arrow_upward"
          ariaLabel={t("footer.scroll_to_top")}
          onClick={scrollToTop}
        />
      </div>
    </footer>
  );
};

export default Footer;
