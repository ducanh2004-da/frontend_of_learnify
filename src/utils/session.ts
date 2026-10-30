import { useSession } from "@tanstack/react-start/server";
import type { TSessionUser } from "@/router";

export type TSessionData = {
  user?: TSessionUser;
  loggedInAt?: number;
};

const FALLBACK_SESSION_SECRET =
  "learnify-fe-default-session-secret-key-min-32-chars!";

export function useAppSession() {
  const envSecret = process.env.SESSION_SECRET;
  const password =
    envSecret && envSecret.length >= 32 ? envSecret : FALLBACK_SESSION_SECRET;

  return useSession<TSessionData>({
    name: "learnify-fe-session",
    password,
    cookie: {
      secure:
        process.env.SECURE_COOKIE === "true" ||
        (import.meta.env.PROD && process.env.SECURE_COOKIE !== "false"),
      sameSite: "lax",
      httpOnly: true,
      maxAge: 45 * 60,
      path: "/",
    },
  });
}
