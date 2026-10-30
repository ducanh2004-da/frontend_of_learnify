import { getCookie, setCookie } from "vinxi/http";
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

  // Đọc và ghi cookie thông qua vinxi/http
  const session = await getIronSession<TSessionData>(
    {
      read: (name) => getCookie(name) || "",
      write: (name, value, opts) => setCookie(name, value, opts as any),
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
      // Đã loại bỏ 'isNew' khỏi object destructuring
      const { save, destroy, ...payload } = session;
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
