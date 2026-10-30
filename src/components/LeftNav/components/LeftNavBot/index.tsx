import "./style.scss";

import Icon, { type TIconName } from "@/components/Icon";
import IconButton from "@/components/IconButton";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslation } from "react-i18next";

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

type TPortal = {
  key: string;
  path: string;
  icon: TIconName;
  labelKey: string;
};

const PORTALS: TPortal[] = [
  {
    key: "learner",
    path: "/learner",
    icon: "school",
    labelKey: "common.switch_to_learner",
  },
  {
    key: "instructor",
    path: "/instructor",
    icon: "local_library",
    labelKey: "common.switch_to_instructor",
  },
  {
    key: "reviewer",
    path: "/reviewer",
    icon: "verified",
    labelKey: "common.switch_to_reviewer",
  },
  {
    key: "admin",
    path: "/admin",
    icon: "settings",
    labelKey: "common.switch_to_admin",
  },
];

const ROLE_PORTALS: Record<string, string[]> = {
  learner: ["learner"],
  instructor: ["learner", "instructor"],
  reviewer: ["learner", "reviewer"],
  admin: ["learner", "instructor", "reviewer", "admin"],
};

const LeftNavBot = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const hydrated = useHydrated();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = user?.role ?? null;
  const availablePortals = role ? (ROLE_PORTALS[role] ?? []) : [];
  const currentPortal = PORTALS.find((p) => pathname.startsWith(p.path));
  const portalIcon = currentPortal?.icon ?? "school";
  const portalOptions = PORTALS.filter(
    (p) => availablePortals.includes(p.key) && p.key !== currentPortal?.key
  );

  const toggleLanguage = () => {
    const next = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(next);
  };

  const handlePortalSelect = useCallback(
    (path: string) => {
      setIsOpen(false);
      navigate({ to: path });
    },
    [navigate]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="left-nav-bot">
      {portalOptions.length > 0 && (
        <div className="left-nav-bot__portal" ref={dropdownRef}>
          <IconButton
            icon={portalIcon}
            shape="circle"
            type="outlined"
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            tooltip={t("common.switch_portal")}
            ariaLabel={t("common.switch_portal")}
          />
          {isOpen && (
            <div className="left-nav-bot__dropdown">
              {portalOptions.map((portal) => (
                <button
                  key={portal.key}
                  className="left-nav-bot__dropdown-item"
                  onClick={() => handlePortalSelect(portal.path)}
                  type="button"
                >
                  <Icon
                    name={portal.icon}
                    className="left-nav-bot__dropdown-icon"
                  />
                  <span className="left-nav-bot__dropdown-label">
                    {t(portal.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <IconButton
        icon={i18n.language === "en" ? "globe_asia" : "language"}
        shape="circle"
        type="outlined"
        size="small"
        onClick={toggleLanguage}
        tooltip={t("common.language")}
        ariaLabel={t("common.language")}
      />
      {!hydrated ? (
        <div className="left-nav-bot__theme-placeholder" />
      ) : (
        <IconButton
          icon={theme === "light" ? "dark_mode" : "light_mode"}
          specialIcon={theme === "light" ? "light_mode" : "dark_mode"}
          shape="circle"
          type="outlined"
          size="small"
          onClick={toggleTheme}
          tooltip={t("common.toggle_dark_mode")}
          ariaLabel={t("common.toggle_dark_mode")}
        />
      )}
    </div>
  );
};

export default LeftNavBot;
