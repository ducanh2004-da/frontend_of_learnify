import AccountMenu from "@/components/AccountMenu";
import IconButton from "@/components/IconButton";
import NotificationPopup from "@/components/NotificationPopup";
import classNames from "classnames";
import { useMemo, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { logoutFn } from "@/server/auth";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAuthStore } from "@/store/authStore";
import TextButton from "@/components/TextButton";
import { COLORS } from "@/styles/colors";
import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import "./style.scss";

const TopNavRight = () => {
  const { t } = useTranslation();
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isAuthenticated, user, onLogout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      onLogout: state.logout,
    }))
  );

  useOnClickOutside(containerRef, () => {
    if (accountMenuVisible) setAccountMenuVisible(false);
  });

  useOnClickOutside(notifyRef, () => {
    if (notificationVisible) setNotificationVisible(false);
  });

  const handleLogout = useCallback(async () => {
    await logoutFn();
    onLogout();
    navigate({ to: "/auth/log-in" });
  }, [onLogout, navigate]);

  const accountMenuClassName = useMemo(() => {
    return classNames({ invisible: !accountMenuVisible });
  }, [accountMenuVisible]);

  const renderContent = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <TextButton
            text={t("pill_top_nav.sign_up")}
            icon="person_add"
            type="secondary"
            size="small"
            onClick={() => navigate({ to: "/auth/sign-up" })}
          />
          <TextButton
            text={t("pill_top_nav.log_in")}
            icon="login"
            type="secondary"
            backgroundColor={COLORS.modeGreen}
            size="small"
            color={COLORS.white}
            onClick={() => navigate({ to: "/auth/log-in" })}
          />
        </>
      );
    }

    return (
      <>
        <div ref={notifyRef}>
          <NotificationPopup
            className={classNames({ invisible: !notificationVisible })}
          />
        </div>
        <TextButton
          icon="diamond"
          text={String(
            user.diamond ?? (user as { diamonds?: number })?.diamonds ?? 0
          )}
          tooltip={t("pill_top_nav.diamond_tooltip")}
          onClick={() => navigate({ to: "/learner/shop" })}
          size="small"
          type="secondary"
          typeSecondary="pastelNavy"
        />
        <TextButton
          icon="mode_heat"
          text={String(
            user.currentSteak ??
              (user as { currentStreak?: number })?.currentStreak ??
              0
          )}
          tooltip={t("pill_top_nav.streak_tooltip")}
          onClick={() => navigate({ to: "/learner/streak" })}
          size="small"
          type="secondary"
          typeSecondary="pastelOrange"
        />
        <IconButton
          icon="notifications_active"
          specialIcon="notifications"
          type="outlined"
          size="tiny"
          shape="circle"
          ariaLabel="Notifications"
          onClick={() => setNotificationVisible(!notificationVisible)}
        />
        <IconButton
          icon="person"
          specialIcon="person"
          type="outlined"
          size="tiny"
          shape="circle"
          ariaLabel="Account menu"
          onClick={() => setAccountMenuVisible(!accountMenuVisible)}
        />
        <AccountMenu
          username={user.username || "User"}
          uid={user.email || ""}
          id={user.id || ""}
          subscription={user.subscription || "Starter"}
          className={accountMenuClassName}
          onLogout={handleLogout}
        />
      </>
    );
  };

  return (
    <div className="top-nav-right" ref={containerRef}>
      {renderContent()}
    </div>
  );
};

export default TopNavRight;
