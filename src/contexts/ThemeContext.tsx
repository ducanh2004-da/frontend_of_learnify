import { createContext, useContext } from "react";
import type { TTheme } from "@/hooks/useTheme";

const ThemeContext = createContext<TTheme | undefined>(undefined);

export const ThemeProvider = ThemeContext.Provider;

export default ThemeContext;

export function useServerTheme() {
  return useContext(ThemeContext);
}
