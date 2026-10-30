import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useThemeStore } from "@/store/themeStore";
import IconButton from "@/components/IconButton";
import "./style.scss";
import classNames from "classnames";

type TAuthControlsProps = {
  style?: React.CSSProperties;
  className?: string;
};

const AuthControls = (props: TAuthControlsProps) => {
  const { style, className } = props;
  const { t } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const toggleLanguage = () => {
    const next = lang === "en" ? "vi" : "en";
    i18n.changeLanguage(next);
    setLang(next);
  };

  return (
    <div className={classNames("auth-controls", className)} style={style}>
      <IconButton
        icon={lang === "en" ? "globe_asia" : "language"}
        type="secondary"
        shape="circle"
        size="small"
        tooltip={t("common.change_language")}
        ariaLabel={t("common.change_language")}
        onClick={toggleLanguage}
      />
      <IconButton
        icon={theme === "light" ? "dark_mode" : "light_mode"}
        type="secondary"
        shape="circle"
        size="small"
        tooltip={t("common.toggle_dark_mode")}
        ariaLabel={t("common.toggle_dark_mode")}
        onClick={toggleTheme}
      />
    </div>
  );
};

export default AuthControls;
