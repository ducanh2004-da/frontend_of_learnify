import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/translation.json";
import vi from "@/locales/vi/translation.json";

const readCookieLang = () => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)app-language=([^;]*)/);
    return match?.[1] || null;
  }
  return null;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: readCookieLang() || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.cookie = `app-language=${lng};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = lng;
  }
});

export const initI18n = (lang?: string | null) => {
  if (lang && lang !== i18n.language) {
    i18n.changeLanguage(lang);
  }
};

export default i18n;
