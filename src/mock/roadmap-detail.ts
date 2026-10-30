import type { TProgress, TSpecial, TStatusCard } from "@/types/global";

export type MockRoadmapDetail = {
  id: number;
  typeSpecial: TSpecial;
  title: string;
  description?: string;
  duration?: number;
  status?: TStatusCard;
  listFeature?: string[];
  percentage?: TProgress;
};

export const MOCK_ROADMAP_DETAILS: MockRoadmapDetail[] = [
  {
    id: 1,
    typeSpecial: "course",
    title: "Generative AI",
    description:
      "Learn the fundamentals of Generative AI, how it differs from traditional machine learning, and explore the core technologies behind large language models.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 2,
    typeSpecial: "course",
    title: "Generative AI",
    description:
      "Learn the fundamentals of Generative AI, how it differs from traditional machine learning, and explore the core technologies behind large language models.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 3,
    typeSpecial: "course",
    title: "Generative AI",
    description:
      "Learn the fundamentals of Generative AI, how it differs from traditional machine learning, and explore the core technologies behind large language models.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 4,
    typeSpecial: "course",
    title: "Generative AI",
    description:
      "Learn the fundamentals of Generative AI, how it differs from traditional machine learning, and explore the core technologies behind large language models.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
];
