import type { TProgress, TSpecial, TStatusCard } from "@/types/global";

export type MockCourse = {
  id: number;
  typeSpecial: TSpecial;
  title: string;
  description?: string;
  duration?: number;
  status?: TStatusCard;
  listFeature?: string[];
  percentage?: TProgress;
  badgeStatus?: "public" | "private";
};

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 1,
    typeSpecial: "course",
    title: "Mastering ReactJS & TanStack",
    description:
      "Course from basic to advanced on the TanStack ecosystem, including Router, Query, and Start.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 2,
    typeSpecial: "course",
    title: "UI/UX Hands-on for Developers",
    description:
      "Learn to design beautiful interfaces and optimize user experience with TailwindCSS.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 3,
    typeSpecial: "course",
    title: "NestJS Backend API",
    description:
      "Build powerful, scalable API systems with NestJS and TypeScript.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 4,
    typeSpecial: "course",
    title: "Basic database",
    description: "Build powerful, optimized Database systems.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
  {
    id: 5,
    typeSpecial: "course",
    title: "NestJS Backend API",
    description:
      "Build powerful, scalable API systems with NestJS and TypeScript.",
    duration: 45,
    status: "default",
    listFeature: ["Data Analysis", "Trend Prediction", "Workflow Optimization"],
  },
];
