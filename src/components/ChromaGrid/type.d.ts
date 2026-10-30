import type { ReactNode } from "react";

export type TChromaItem = {
  title: string;
  subtitle: string;
  image: ReactNode;
  handle?: string;
  location?: string;
  borderColor: string;
  gradient: string;
  url?: string;
};

export type TChromaGridProps = {
  items?: TChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
};
