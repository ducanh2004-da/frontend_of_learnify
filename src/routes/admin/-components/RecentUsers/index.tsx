import "./style.scss";

import TextButton from "@/components/TextButton";
import type { TAdminUser } from "@/hooks/useAdminUsers";
import type { TTypeSecondary } from "@/types/global";
import type { TFunction } from "i18next";
import capitalize from "lodash/capitalize";
import { useTranslation } from "react-i18next";

type RecentUsersProps = {
  users: TAdminUser[];
};

const ROLE_MOD: Record<string, TTypeSecondary> = {
  learner: "pastelNavy",
  user: "pastelNavy",
  instructor: "green",
  reviewer: "yellow",
  admin: "salmon",
};

const getTimeAgo = (date: string, t: TFunction) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("admin.recent_users.just_now");
  if (mins < 60) return t("admin.recent_users.min_ago", { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t("admin.recent_users.hr_ago", { count: hrs });
  const days = Math.floor(hrs / 24);
  return t("admin.recent_users.days_ago", { count: days });
};

const RecentUsers = ({ users }: RecentUsersProps) => {
  const { t } = useTranslation();

  return (
    <div className="admin-recent-users">
      <div className="admin-recent-users__header">
        <h2 className="admin-recent-users__title">
          {t("admin.recent_users.title")}
        </h2>
      </div>

      <ul className="admin-recent-users__list">
        {users.length === 0 && (
          <li className="admin-recent-users__empty">
            {t("admin.recent_users.empty")}
          </li>
        )}

        {users.map((user) => (
          <li key={user.id} className="admin-recent-users__item">
            <div className="admin-recent-users__avatar" aria-hidden="true">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="admin-recent-users__avatar-img"
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="admin-recent-users__info">
              <span className="admin-recent-users__name">{user.username}</span>
              <span className="admin-recent-users__email">{user.email}</span>
            </div>
            <div className="admin-recent-users__meta">
              <TextButton
                size="tiny"
                type="secondary"
                className={`admin-recent-users__role admin-recent-users__role--${user.role?.toLowerCase() ?? ""}`}
                onClick={() => {}}
                text={capitalize(user.role || "user")}
                leftIcon={false}
                typeSecondary={
                  ROLE_MOD[user.role?.toLowerCase() ?? ""] ?? "navy"
                }
              />
              <span className="admin-recent-users__time">
                {getTimeAgo(user.createdAt, t)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUsers;
