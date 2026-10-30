import type { TAboutStatProps } from "@learner/about/-types/about";
import { COLORS } from "@/styles/colors";

export interface TeamMember {
  key: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    key: "sarah",
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former educator turned entrepreneur. Passionate about democratizing access to world-class education.",
  },
  {
    key: "marcus",
    name: "Marcus Johnson",
    role: "CTO & Co-Founder",
    bio: "AI researcher and full-stack engineer. Building the future of interactive learning experiences.",
  },
  {
    key: "aisha",
    name: "Aisha Patel",
    role: "Head of Product",
    bio: "Product leader with a background in instructional design. Focused on learner-centered design.",
  },
  {
    key: "david",
    name: "David Kim",
    role: "Lead 3D Engineer",
    bio: "Graphics programmer and Three.js expert. Crafting immersive educational environments.",
  },
];

export const ABOUT_VALUES = [
  {
    key: "learner_first",
    icon: "account_circle",
    title: "Learner First",
    desc: "Every decision we make starts with the learner's experience in mind.",
    iconColor: "#e05b5b",
  },
  {
    key: "innovation",
    icon: "lightbulb",
    title: "Innovation",
    desc: "We embrace AI and modern tech to make education more effective.",
    iconColor: "#e0a03b",
  },
  {
    key: "accessibility",
    icon: "public",
    title: "Accessibility",
    desc: "Quality learning should be available to everyone, everywhere.",
    iconColor: "#3b82f6",
  },
  {
    key: "community",
    icon: "group",
    title: "Community",
    desc: "Growing together through collaboration, sharing, and support.",
    iconColor: "#2d4a3e",
  },
];

export const ABOUT_STATS: (Omit<TAboutStatProps, "index"> & { key: string })[] =
  [
    {
      value: "10K+",
      color: COLORS.navy200,
      key: "trusted_learners",
      label: "Trusted Learners",
    },
    {
      value: "200+",
      color: COLORS.orange150,
      key: "courses",
      label: "Courses",
    },
    {
      value: "3",
      color: COLORS.darkGreen300,
      key: "members",
      label: "Members",
    },
    {
      value: "200",
      color: COLORS.brown150,
      key: "trusted_partners",
      label: "Trusted Partners",
    },
  ];

export const MISSION_TEXT =
  "To democratize education by combining cutting-edge AI technology with immersive 3D learning experiences, making world-class education accessible to everyone, everywhere.";

export const VISION_TEXT =
  "A world where anyone can learn any skill through personalized, AI-guided instruction — breaking down barriers of cost, location, and traditional teaching limitations.";
