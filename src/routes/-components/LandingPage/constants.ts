import type { TIconName } from "@/components/Icon";

export const HOW_IT_WORKS: {
  step: string;
  icon: TIconName;
  key: string;
}[] = [
  {
    step: "01",
    icon: "search",
    key: "browse",
  },
  {
    step: "02",
    icon: "play_circle",
    key: "enroll",
  },
  {
    step: "03",
    icon: "smart_toy",
    key: "learn",
  },
  {
    step: "04",
    icon: "verified",
    key: "certificate",
  },
];

export const AUDIENCES: {
  icon: TIconName;
  key: string;
  to: string;
}[] = [
  {
    icon: "school",
    key: "learners",
    to: "/auth/sign-up",
  },
  {
    icon: "local_library",
    key: "instructors",
    to: "/auth/sign-up",
  },
  {
    icon: "public",
    key: "institutions",
    to: "/auth/sign-up",
  },
];
