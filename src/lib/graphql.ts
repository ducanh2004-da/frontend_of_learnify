import { GraphQLClient } from "graphql-request";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { logoutFn } from "@/server/auth";

const DEFAULT_BACKEND_GRAPHQL_URL = "https://learnify-be.onrender.com/graphql";

const getDirectBackendGraphqlUrl = (): string => {
  const candidates = [
    typeof process !== "undefined" ? process.env.BACKEND_URL : undefined,
    import.meta.env.VITE_BACKEND_URL,
    import.meta.env.VITE_GRAPHQL_ENDPOINT,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      (candidate.startsWith("http://") || candidate.startsWith("https://"))
    ) {
      return candidate;
    }
  }

  return DEFAULT_BACKEND_GRAPHQL_URL;
};

const shouldUseReverseProxy = (): boolean => {
  if (typeof window === "undefined") return false;
  if (import.meta.env.VITE_DISABLE_PROXY === "true") return false;
  if (import.meta.env.VITE_GRAPHQL_ENDPOINT?.startsWith("/")) return true;
  return import.meta.env.PROD;
};

export const getGraphqlEndpoint = (): string => {
  if (shouldUseReverseProxy() && typeof window !== "undefined") {
    const proxyPath = import.meta.env.VITE_GRAPHQL_ENDPOINT?.startsWith("/")
      ? import.meta.env.VITE_GRAPHQL_ENDPOINT
      : "/backend-graphql";
    return new URL(proxyPath, window.location.origin).toString();
  }
  return getDirectBackendGraphqlUrl();
};

export const getCsrfEndpoint = (): string => {
  if (shouldUseReverseProxy() && typeof window !== "undefined") {
    return new URL("/csrf-token", window.location.origin).toString();
  }
  return new URL("/csrf-token", getDirectBackendGraphqlUrl()).toString();
};

export const GRAPHQL_ENDPOINT = getGraphqlEndpoint();

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
  const response = await fetch(getCsrfEndpoint(), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
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
  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
};

const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  // The CSRF cookie lives in the browser; SSR requests call the backend directly.
  if (typeof window === "undefined") {
    return fetch(getDirectBackendGraphqlUrl(), {
      ...init,
      credentials: "include",
      cache: "no-store",
    });
  }

  const targetUrl = getGraphqlEndpoint();
  let response = await sendWithCsrf(targetUrl, init, false);
  let codes = await getErrorCodes(response);

  if (response.status === 403 || codes.includes(CSRF_ERROR_CODE)) {
    response = await sendWithCsrf(targetUrl, init, true);
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
