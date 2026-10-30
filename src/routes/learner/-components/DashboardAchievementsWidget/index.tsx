import { useTranslation } from "react-i18next";
import "./style.scss";

const DashboardAchievementsWidget = () => {
  const { t } = useTranslation();

  return (
    <div className="achievements-widget">
      <div className="achievements-widget__header">
        <h3>{t("dashboard.achievements")}</h3>
        <span className="count">50 / 150</span>
      </div>
      <div className="achievements-widget__badges">
        <div className="badge-mock yellow">
          <div className="inner-shape"></div>
          <span className="label">{t("dashboard.badge_path_enroll")}</span>
        </div>
        <div className="badge-mock red">
          <div className="inner-shape"></div>
          <span className="label">{t("dashboard.badge_first_lab")}</span>
        </div>
      </div>
      <div className="achievements-widget__action">
        <button className="btn-more">{t("dashboard.more")}</button>
      </div>
    </div>
  );
};

export default DashboardAchievementsWidget;
