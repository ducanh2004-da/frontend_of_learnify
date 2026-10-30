import type { TIconName } from "@/components/Icon";

export type TCategoryKey =
  | "ai_llm"
  | "calculus"
  | "program"
  | "data"
  | "design"
  | "language";

export type TCategory = {
  icon: TIconName;
  labelKey: string;
  key: TCategoryKey;
  keywords: string[];
};

export const CATEGORIES: TCategory[] = [
  {
    icon: "smart_toy",
    labelKey: "roadmaps.categories.ai_llm",
    key: "ai_llm",
    keywords: [
      "ai",
      "llm",
      "machine learning",
      "neural",
      "deep learning",
      "intelligence",
    ],
  },
  {
    icon: "calculate",
    labelKey: "roadmaps.categories.calculus",
    key: "calculus",
    keywords: [
      "calculus",
      "math",
      "linear algebra",
      "statistics",
      "probability",
    ],
  },
  {
    icon: "code",
    labelKey: "roadmaps.categories.program",
    key: "program",
    keywords: [
      "program",
      "code",
      "software",
      "development",
      "engineering",
      "fullstack",
      "backend",
      "frontend",
    ],
  },
  {
    icon: "bar_chart",
    labelKey: "roadmaps.categories.data",
    key: "data",
    keywords: ["data", "analytics", "database", "sql", "big data"],
  },
  {
    icon: "brush",
    labelKey: "roadmaps.categories.design",
    key: "design",
    keywords: ["design", "ui", "ux", "graphic", "visual"],
  },
  {
    icon: "language",
    labelKey: "roadmaps.categories.language",
    key: "language",
    keywords: [
      "language",
      "linguistics",
      "translation",
      "english",
      "vietnamese",
    ],
  },
];
