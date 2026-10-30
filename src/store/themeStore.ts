import { create } from "zustand";

export type TTheme = "light" | "dark";

type ThemeState = {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
};

const readTheme = (): TTheme => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)app-theme=([^;]*)/);
    if (match?.[1]) return match[1] as TTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const syncDOM = (theme: TTheme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document.cookie = `app-theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    syncDOM(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      syncDOM(next);
      return { theme: next };
    }),
}));
