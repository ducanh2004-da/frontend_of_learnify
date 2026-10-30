import { useThemeStore } from "@/store/themeStore";
import type { TTheme } from "@/store/themeStore";

export type { TTheme };

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return { theme, toggleTheme };
};
