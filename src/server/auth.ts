import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/utils/session";
import { z } from "zod";
import { getLanguageCookie, getThemeCookie } from "./cookies.server";

const SESSION_TTL = 45 * 60 * 1000;

type UserData = {
  id: string | number;
  email: string;
  username?: string;
  role?: string;
  diamond?: number;
  currentSteak?: number;
};

const sessionSchema = z.object({
  id: z.string(),
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
  }),
  username: z.string().optional(),
  role: z.string().optional(),
  diamond: z.number().optional(),
  currentSteak: z.number().optional(),
});

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    const user = session.data.user || null;

    if (user && session.data.loggedInAt) {
      const elapsed = Date.now() - session.data.loggedInAt;
      if (elapsed > SESSION_TTL) {
        await session.clear();
        return { user: null, expired: true };
      }
    }

    return { user, expired: false };
  }
);

export const setSessionFn = createServerFn({ method: "POST" })
  .inputValidator((data: UserData) => sessionSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await useAppSession();
    await session.update({ user: data, loggedInAt: Date.now() });
    return { success: true };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  return { success: true };
});

export const getServerCookiesFn = createServerFn({ method: "GET" }).handler(
  async () => ({
    language: getLanguageCookie(),
    theme: getThemeCookie(),
  })
);
