import "./settings.scss";

import { useTranslation } from "react-i18next";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useThemeStore } from "@/store/themeStore";
import Icon from "@/components/Icon";

export const Route = createLazyFileRoute("/learner/settings/")({
  component: Settings,
});

function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="settings-page">
      <h1 className="settings-page_title">{t("settings.title")}</h1>

      <div className="settings-page_section">
        <div className="settings-page_row">
          <div className="settings-page_row-left">
            <Icon name={theme === "dark" ? "dark_mode" : "light_mode"} />
            <span>{t("settings.theme")}</span>
          </div>
          <button className="settings-page_btn" onClick={toggleTheme}>
            {theme === "dark" ? t("settings.dark") : t("settings.light")}
          </button>
        </div>

        <div className="settings-page_row">
          <div className="settings-page_row-left">
            <Icon name="language" />
            <span>{t("settings.language")}</span>
          </div>
          <button
            className="settings-page_btn"
            onClick={() =>
              i18n.changeLanguage(i18n.language === "en" ? "vi" : "en")
            }
          >
            {i18n.language === "en" ? "EN" : "VI"}
          </button>
        </div>
      </div>
    </div>
  );
}
