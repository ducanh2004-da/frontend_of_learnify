import classnames from "classnames";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";
import type { TNotificationPopupProps } from "./type";

import "./style.scss";

const NotificationPopup = (props: TNotificationPopupProps) => {
  const { t } = useTranslation();
  const { className } = props;

  return (
    <div className={classnames("notification-popup", className)}>
      <div className="notification-popup_header">
        <span className="notification-popup_title">
          {t("notification.title")}
        </span>
      </div>
      <div className="notification-popup_body">
        <Icon name="notifications" />
        <p className="notification-popup_empty">
          {t("notification.no_notifications")}
        </p>
      </div>
    </div>
  );
};

export default NotificationPopup;
