import "./style.scss";

import Icon from "@/components/Icon";
import { useTranslation } from "react-i18next";

type StatsGridProps = {
  totalUsers: number;
  todaySubscribers: number;
};

const StatsGrid = ({ totalUsers, todaySubscribers }: StatsGridProps) => {
  const { t } = useTranslation();

  const STAT_CARDS = [
    {
      id: "stat-total-users",
      labelKey: "admin.stats.total_users",
      value: totalUsers.toLocaleString(),
      icon: "group" as const,
      trend: t("admin.stats.trend"),
      trendUp: true,
      colorMod: "blue" as const,
    },
    {
      id: "stat-today-subscribers",
      labelKey: "admin.stats.today_subscriber",
      value: todaySubscribers.toLocaleString(),
      icon: "person_add" as const,
      trend: t("admin.stats.trend"),
      trendUp: true,
      colorMod: "green" as const,
    },
    {
      id: "stat-revenue",
      labelKey: "admin.stats.revenue",
      value: "$48,290",
      icon: "payments" as const,
      trend: t("admin.stats.trend"),
      trendUp: true,
      colorMod: "orange" as const,
    },
    {
      id: "stat-system-bugs",
      labelKey: "admin.stats.system_bugs",
      value: "7",
      icon: "bug_report" as const,
      trend: t("admin.stats.trend"),
      trendUp: false,
      colorMod: "red" as const,
    },
  ];

  return (
    <div className="admin-stats-grid">
      {STAT_CARDS.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className={`admin-stats-grid__card admin-stats-grid__card--${card.colorMod}`}
        >
          <div className="admin-stats-grid__card-top">
            <div className="admin-stats-grid__icon-wrap">
              <Icon name={card.icon} size={22} />
            </div>
            <span className="admin-stats-grid__label">{t(card.labelKey)}</span>
          </div>
          <p className="admin-stats-grid__value">{card.value}</p>
          {card.trend && (
            <p
              className={`admin-stats-grid__trend ${
                card.trendUp
                  ? "admin-stats-grid__trend--up"
                  : "admin-stats-grid__trend--down"
              }`}
            >
              <Icon
                name={card.trendUp ? "trending_up" : "trending_down"}
                size={14}
              />
              {card.trend}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
