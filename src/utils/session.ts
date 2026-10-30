import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getIronSession } from "iron-session";
import type { TSessionUser } from "@/router";

export type TSessionData = {
  user?: TSessionUser;
  loggedInAt?: number;
};

const FALLBACK_SESSION_SECRET =
  "learnify-fe-default-session-secret-key-min-32-chars!";

export async function useAppSession() {
  const envSecret = process.env.SESSION_SECRET;
  const password =
    envSecret && envSecret.length >= 32 ? envSecret : FALLBACK_SESSION_SECRET;

  const session = await getIronSession<TSessionData>(
    {
      read: (name) => getCookie(name) || "",
      write: (name, value, opts) => setCookie(name, value, opts),
    },
    {
      cookieName: "learnify-fe-session",
      password,
      cookieOptions: {
        secure:
          process.env.SECURE_COOKIE === "true" ||
          (import.meta.env.PROD && process.env.SECURE_COOKIE !== "false"),
        sameSite: "lax",
        httpOnly: true,
        maxAge: 45 * 60,
        path: "/",
      },
    }
  );

  return {
    get data() {
      const { save, destroy, ...payload } = session;
      void save;
      void destroy;
      return Object.keys(payload).length > 0
        ? (payload as TSessionData)
        : undefined;
    },
    update: async (newData: TSessionData) => {
      Object.assign(session, newData);
      await session.save();
    },
    clear: async () => {
      session.destroy();
    },
  };
}
