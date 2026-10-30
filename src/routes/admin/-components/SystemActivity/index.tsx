import "./style.scss";

import { useTranslation } from "react-i18next";
import Icon, { type TIconName } from "@/components/Icon";

type TActivityItem = {
  id: string;
  icon: TIconName;
  iconMod: "blue" | "green" | "orange" | "red";
  message: string;
  time: string;
};

const MOCK_ACTIVITIES: TActivityItem[] = [
  {
    id: "a1",
    icon: "person_add",
    iconMod: "green",
    message: "New user Alice Nguyen registered",
    time: "2 min ago",
  },
  {
    id: "a2",
    icon: "bug_report",
    iconMod: "red",
    message: "Error spike detected on /api/courses",
    time: "15 min ago",
  },
  {
    id: "a3",
    icon: "payments",
    iconMod: "orange",
    message: "Payment of $199 received from Bob M.",
    time: "42 min ago",
  },
  {
    id: "a4",
    icon: "verified",
    iconMod: "blue",
    message: "Course 'React Basics' published",
    time: "1 hr ago",
  },
  {
    id: "a5",
    icon: "delete",
    iconMod: "red",
    message: "User account david@learnify.io removed",
    time: "2 hr ago",
  },
  {
    id: "a6",
    icon: "settings",
    iconMod: "blue",
    message: "System maintenance completed",
    time: "4 hr ago",
  },
];

const SystemActivity = () => {
  const { t } = useTranslation();

  return (
    <div className="admin-system-activity">
      <div className="admin-system-activity__header">
        <h2 className="admin-system-activity__title">
          {t("admin.system_activity.title")}
        </h2>
      </div>

      <ul className="admin-system-activity__list">
        {MOCK_ACTIVITIES.map((item) => (
          <li key={item.id} className="admin-system-activity__item">
            <div
              className={`admin-system-activity__icon-wrap admin-system-activity__icon-wrap--${item.iconMod}`}
            >
              <Icon name={item.icon} size={16} />
            </div>
            <div className="admin-system-activity__body">
              <p className="admin-system-activity__message">{item.message}</p>
              <span className="admin-system-activity__time">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemActivity;
