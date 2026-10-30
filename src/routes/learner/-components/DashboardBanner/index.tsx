import { useTranslation } from "react-i18next";
import { Flower } from "@/components/Shapes/Flower";
import { COLORS } from "@/styles/colors";
import "./style.scss";

const DashboardBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-banner">
      <div className="dashboard-banner__icon">
        <Flower
          size="300px"
          color={COLORS.modeGreen}
          stroke={COLORS.modeOrange}
          strokeWidth={50}
        />
      </div>

      <div className="dashboard-banner__content">
        <h2 className="dashboard-banner__content-title">
          {t("dashboard.banner_title")}
        </h2>
        <p className="dashboard-banner__content-description">
          {t("dashboard.banner_description")}
        </p>
      </div>

      <div className="dashboard-banner__action">
        <button>{t("dashboard.explore_courses")}</button>
      </div>
    </div>
  );
};

export default DashboardBanner;
