import type { TRole } from "@/types/global";

const VALID_ROLES: readonly TRole[] = [
  "learner",
  "instructor",
  "reviewer",
  "admin",
];

export function normalizeRole(raw: unknown): TRole {
  const lowered = typeof raw === "string" ? raw.toLowerCase() : "";
  if (lowered === "teacher") return "instructor";
  return (VALID_ROLES as readonly string[]).includes(lowered)
    ? (lowered as TRole)
    : "learner";
}

const ROLE_DEFAULT_ROUTE: Record<TRole, string> = {
  learner: "/learner",
  instructor: "/instructor/course-builder",
  reviewer: "/reviewer/courses",
  admin: "/admin",
};

export function getRoleDefaultRoute(role: TRole): string {
  return ROLE_DEFAULT_ROUTE[role] ?? "/learner";
}
