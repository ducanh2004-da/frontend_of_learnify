import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

export type TLayoutConfig = {
  compactLeftNav: boolean;
  showFooter: boolean;
  fullInner: boolean;
  customTitle?: string;
  showSearch: boolean;
};

export type TLayoutContextValue = TLayoutConfig & {
  setLayoutConfigState: React.Dispatch<React.SetStateAction<TLayoutConfig>>;
};

const LayoutContext = createContext<TLayoutContextValue | undefined>(undefined);

export const LayoutProvider = ({ children }: PropsWithChildren) => {
  const [layoutConfig, setLayoutConfigState] = useState<TLayoutConfig>({
    compactLeftNav: false,
    showFooter: true,
    fullInner: false,
    showSearch: false,
  });

  const value = {
    ...layoutConfig,
    setLayoutConfigState,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;

export function useLayout() {
  const layoutContext = useContext(LayoutContext);
  if (!layoutContext) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return layoutContext;
}
