import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import "./style.scss";

const DashboardStreakWidget = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currentStreak =
    user?.currentSteak ??
    (user as { currentStreak?: number } | null | undefined)?.currentStreak ??
    0;
  const days = t("dashboard.day_labels", { returnObjects: true }) as string[];

  const todayIndex = new Date().getDay();
  const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <div className="streak-widget">
      <div className="streak-widget__top">
        <h1 className="streak-widget__top-number">{currentStreak}</h1>
        <div className="streak-widget__top-info">
          <span className="fire-icon">🔥</span>
          <span
            className="streak-text"
            dangerouslySetInnerHTML={{ __html: t("dashboard.current_streak") }}
          />
        </div>
      </div>
      <hr className="streak-widget__divider" />
      <div className="streak-widget__days">
        {days.map((day, index) => (
          <div key={day} className="streak-widget__days-item">
            <div
              className={classnames("circle", {
                "circle--active": currentStreak > 0 && index === adjustedIndex,
                "circle--streak":
                  currentStreak > 0 &&
                  index < adjustedIndex &&
                  index >= adjustedIndex - Math.min(currentStreak - 1, 6),
              })}
            />
            <span>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStreakWidget;
