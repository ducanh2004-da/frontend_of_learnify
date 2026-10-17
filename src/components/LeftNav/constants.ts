import type { TIconName } from "@/components/Icon";

export type TTopItem = {
  iconName: TIconName;
  labelKey: string;
  href: string;
};

export const learnerTopItems: TTopItem[] = [
  {
    iconName: "local_library",
    labelKey: "sidebar.dashboard",
    href: "/learner/dashboard",
  },
  {
    iconName: "book",
    labelKey: "sidebar.courses",
    href: "/learner/courses",
  },
  {
    iconName: "conversion_path",
    labelKey: "sidebar.roadmaps",
    href: "/learner/roadmaps",
  },
  {
    iconName: "group",
    labelKey: "sidebar.friends",
    href: "/learner/friends",
  },
  {
    iconName: "info",
    labelKey: "sidebar.about",
    href: "/learner/about",
  },
];

export const instructorTopItems: TTopItem[] = [
  {
    iconName: "local_library",
    labelKey: "sidebar.dashboard",
    href: "/instructor",
  },
  {
    iconName: "add",
    labelKey: "sidebar.course_builder",
    href: "/instructor/course-builder",
  },
  {
    iconName: "school",
    labelKey: "sidebar.manage_courses",
    href: "/instructor/courses",
  },
];

export const reviewerTopItems: TTopItem[] = [
  {
    iconName: "local_library",
    labelKey: "sidebar.dashboard",
    href: "/reviewer",
  },
  {
    iconName: "school",
    labelKey: "sidebar.manage_courses",
    href: "/reviewer/courses",
  },
];

export const adminTopItems: TTopItem[] = [
  {
    iconName: "dashboard",
    labelKey: "admin.sidebar.dashboard",
    href: "/admin",
  },
  {
    iconName: "group",
    labelKey: "admin.sidebar.user_management",
    href: "/admin/users",
  },
];

export function getTopItemsByPathname(pathname: string): TTopItem[] {
  if (pathname.startsWith("/instructor")) {
    return instructorTopItems;
  }
  if (pathname.startsWith("/reviewer")) {
    return reviewerTopItems;
  }
  if (pathname.startsWith("/admin")) {
    return adminTopItems;
  }
  return learnerTopItems;
}
