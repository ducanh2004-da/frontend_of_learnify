import { CURRENT_USER_QUERY } from "@/graphql/mutations";
import { getGraphqlEndpoint } from "@/lib/graphql";
import { logger } from "@/utils/logger";
import type { User } from "@/utils/users";

export const fetchCurrentUser = async (
  serverCookieHeader?: string
): Promise<User | null> => {
  try {
    const endpoint = getGraphqlEndpoint();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (serverCookieHeader) headers["Cookie"] = serverCookieHeader;

    logger.info("[auth] calling:", endpoint, "| cookie:", !!serverCookieHeader);
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ query: CURRENT_USER_QUERY }),
    });
    logger.info("[auth] response status:", response.status);

    const { data, errors } = await response.json();
    if (errors || !data?.currentUser?.isSuccess) {
      logger.info(
        "[auth] fail - errors:",
        !!errors,
        "| isSuccess:",
        data?.currentUser?.isSuccess
      );
      throw new Error("Failed to load user data");
    }
    const user = data.currentUser.users[0];
    logger.info("[auth] success - user:", user?.id, user);
    return user;
  } catch (error) {
    logger.error("[auth] fetch error:", error);
    throw new Error("Failed to load user data");
  }
};
