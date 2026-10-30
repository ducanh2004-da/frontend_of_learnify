import "./pill-top-nav.scss";

import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import StaggeredMenu from "@/components/StaggeredMenu";
import i18n from "@/i18n";
import { useThemeStore } from "@/store/themeStore";
import { useServerTheme } from "@/contexts/ThemeContext";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslation } from "react-i18next";
import TextButton from "../TextButton";
import { NAV_ITEMS } from "./constants";

export default function PillTopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [lang, setLang] = useState(i18n.language || "en");
  const storeTheme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const serverTheme = useServerTheme();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const theme = hydrated ? storeTheme : (serverTheme ?? storeTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMouseEnter = useCallback((key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 30);
  }, []);

  const toggleLanguage = () => {
    const next = lang === "en" ? "vi" : "en";
    i18n.changeLanguage(next);
    setLang(next);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flatNavItems = useMemo(
    () =>
      NAV_ITEMS.flatMap((item) => {
        if (item.children) {
          return item.children.map((child) => ({
            label: t(`pill_top_nav.${child.key}.title`),
            link: child.href,
          }));
        }
        return [{ label: t(`pill_top_nav.${item.key}`), link: item.href }];
      }).concat([
        { label: t("pill_top_nav.log_in"), link: "/auth/log-in" },
        { label: t("pill_top_nav.sign_up"), link: "/auth/sign-up" },
      ]),
    [t]
  );

  return (
    <>
      <nav
        className="pill-top-nav"
        onMouseLeave={handleMouseLeave}
        data-lenis-prevent
      >
        <div className="pill-top-nav__inner">
          <Logo size="small" className="pill-top-nav__brand" />

          <ul className="pill-top-nav__menu">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.key}
                className="pill-top-nav__item"
                onMouseEnter={() =>
                  item.children?.length && handleMouseEnter(item.key)
                }
              >
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="pill-top-nav__trigger"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.key ? null : item.key
                        )
                      }
                      aria-expanded={openDropdown === item.key}
                    >
                      <span>{t(`pill_top_nav.${item.key}`)}</span>
                      <Icon
                        name="expand_more"
                        size="1.2em"
                        className={`pill-top-nav__arrow ${openDropdown === item.key ? "is-open" : ""}`}
                      />
                    </button>
                    {openDropdown === item.key && (
                      <div className="pill-top-nav__dropdown">
                        <ul className="pill-top-nav__dropdown-list">
                          {item.children.map((child) => (
                            <li key={child.key}>
                              <Link
                                to={child.href}
                                className="pill-top-nav__dropdown-link"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <span className="pill-top-nav__dropdown-title">
                                  {t(`pill_top_nav.${child.key}.title`)}
                                </span>
                                <span className="pill-top-nav__dropdown-desc">
                                  {t(`pill_top_nav.${child.key}.desc`)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="pill-top-nav__link"
                    activeProps={{ className: "is-active" }}
                  >
                    {t(`pill_top_nav.${item.key}`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="pill-top-nav__actions">
            <button
              type="button"
              className="pill-top-nav__toggle pill-top-nav__toggle--menu"
              onClick={() => setMenuOpen(true)}
              title={t("common.menu")}
              aria-label={t("common.menu")}
            >
              <Icon name="menu" size="1.2em" />
            </button>

            <button
              type="button"
              className="pill-top-nav__toggle pill-top-nav__toggle--lang"
              onClick={toggleLanguage}
              title={t("common.change_language")}
            >
              {lang.toUpperCase()}
            </button>

            <button
              type="button"
              className="pill-top-nav__toggle pill-top-nav__toggle--theme"
              onClick={toggleTheme}
              title={t("common.toggle_dark_mode")}
            >
              <Icon
                name={theme === "light" ? "dark_mode" : "light_mode"}
                size="1.2em"
              />
            </button>

            <TextButton
              className="pill-top-nav__action-link"
              onClick={() => {
                navigate({ to: "/auth/log-in" });
              }}
              text={t("pill_top_nav.log_in")}
              size="small"
              leftIcon={false}
              type="secondary"
              roundedCorner="roundedSquare"
            />
            <TextButton
              className="pill-top-nav__action-btn"
              onClick={() => {
                navigate({ to: "/auth/sign-up" });
              }}
              text={t("pill_top_nav.sign_up")}
              size="small"
              leftIcon={false}
              type="primary"
              roundedCorner="roundedSquare"
            />
          </div>
        </div>
      </nav>
      {menuOpen && (
        <StaggeredMenu
          onClose={() => setMenuOpen(false)}
          items={flatNavItems}
        />
      )}
    </>
  );
}
