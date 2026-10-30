import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/components/Icon";
import "./style.scss";

const QuickActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      icon: "add" as const,
      labelKey: "dashboard.create_course",
      onClick: () => navigate({ to: "/instructor/courses" }),
      accent: "green",
    },
    {
      icon: "menu_book" as const,
      labelKey: "dashboard.manage_courses",
      onClick: () => navigate({ to: "/instructor/courses" }),
      accent: "blue",
    },
    {
      icon: "school" as const,
      labelKey: "dashboard.switch_learner",
      onClick: () => navigate({ to: "/learner/dashboard" }),
      accent: "purple",
    },
  ];

  return (
    <div className="quick-actions">
      <h4 className="quick-actions__title semibold">
        {t("dashboard.quick_actions")}
      </h4>
      <div className="quick-actions__list">
        {actions.map((action) => (
          <button
            key={action.labelKey}
            className={`quick-actions__btn quick-actions__btn--${action.accent}`}
            onClick={action.onClick}
          >
            <Icon name={action.icon} size={20} />
            <span>{t(action.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
