import { useTranslation } from "react-i18next";
import "./style.scss";

type TWelcomeHeaderProps = {
  name?: string;
};

const WelcomeHeader = ({ name = "Admin" }: TWelcomeHeaderProps) => {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? t("admin.welcome.greeting_morning")
      : hour < 18
        ? t("admin.welcome.greeting_afternoon")
        : t("admin.welcome.greeting_evening");

  const dateStr = now.toLocaleDateString(i18n.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="admin-welcome">
      <div className="admin-welcome__text">
        <h1 className="admin-welcome__title">
          {greeting}, {name}
        </h1>
        <p className="admin-welcome__subtitle">
          {t("admin.welcome.subtitle")} · {dateStr}
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
