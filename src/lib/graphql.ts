import { GraphQLClient } from "graphql-request";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { logoutFn } from "@/server/auth";

export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT ||
  "https://learnify-be.onrender.com/graphql";

const CSRF_ENDPOINT = new URL("/csrf-token", GRAPHQL_ENDPOINT).toString();
const CSRF_HEADER = "x-csrf-token";
const AUTH_ERROR_CODES = ["UnauthorizedException", "UNAUTHENTICATED"];
const CSRF_ERROR_CODE = "CSRF_TOKEN_INVALID";

type TGraphQLErrorBody = {
  errors?: Array<{ extensions?: { code?: string } }>;
};

type TCsrfTokenResponse = {
  csrfToken?: string;
  token?: string;
};

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

/**
 * Calls `GET /csrf-token` (cookies included) so the backend can set the
 * double-submit cookie, and caches the returned token for later requests.
 */
export const fetchCsrfToken = async (): Promise<string> => {
  const response = await fetch(CSRF_ENDPOINT, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token (${response.status})`);
  }
  const body: TCsrfTokenResponse = await response.json();
  const token = body.csrfToken ?? body.token;
  if (!token) throw new Error("CSRF token missing in response");
  csrfToken = token;
  return token;
};

const ensureCsrfToken = (force = false): Promise<string> => {
  if (!force && csrfToken) return Promise.resolve(csrfToken);
  if (!csrfRequest) {
    csrfRequest = fetchCsrfToken().finally(() => {
      csrfRequest = null;
    });
  }
  return csrfRequest;
};

const handleAuthError = async () => {
  if (typeof window === "undefined") return;
  await logoutFn();
  useAuthStore.getState().logout();
  toast.error("Session expired. Please log in again.");
  window.location.href = "/auth/log-in";
};

const getErrorCodes = async (response: Response): Promise<string[]> => {
  try {
    const body: TGraphQLErrorBody = await response.clone().json();
    return (body.errors ?? []).flatMap((e) =>
      e.extensions?.code ? [e.extensions.code] : []
    );
  } catch {
    return [];
  }
};

const sendWithCsrf = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  forceRefresh: boolean
): Promise<Response> => {
  const headers = new Headers(init?.headers);
  headers.set(CSRF_HEADER, await ensureCsrfToken(forceRefresh));
  return fetch(input, { ...init, headers, credentials: "include" });
};

const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  // The CSRF cookie lives in the browser; SSR requests cannot obtain one.
  if (typeof window === "undefined") {
    return fetch(input, { ...init, credentials: "include" });
  }

  let response = await sendWithCsrf(input, init, false);
  let codes = await getErrorCodes(response);

  if (response.status === 403 || codes.includes(CSRF_ERROR_CODE)) {
    response = await sendWithCsrf(input, init, true);
    codes = await getErrorCodes(response);
  }

  if (
    response.status === 401 ||
    codes.some((c) => AUTH_ERROR_CODES.includes(c))
  ) {
    await handleAuthError();
    return Promise.reject(new Error("Session expired"));
  }

  return response;
};

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
  fetch: customFetch,
});
