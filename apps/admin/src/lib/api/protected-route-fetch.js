const defaultRefreshPath = "/api/auth/refresh";
const defaultLoginPath = "/login";
const sessionExpiredReason = "session-expired";

let inFlightRefreshRequest = null;
let hasTriggeredSessionRedirect = false;

const resolvePathname = (input) => {
  if (input instanceof URL) {
    return input.pathname;
  }

  if (typeof input === "string") {
    try {
      return new URL(input, "http://localhost").pathname;
    } catch {
      return "";
    }
  }

  return "";
};

const isProtectedAdminApiRequest = (input) =>
  resolvePathname(input).startsWith("/api/admin/");

const redirectToLoginOnUnauthorized = () => {
  if (
    hasTriggeredSessionRedirect ||
    typeof window === "undefined" ||
    !window.location ||
    typeof window.location.replace !== "function"
  ) {
    return;
  }

  hasTriggeredSessionRedirect = true;

  const searchParams = new URLSearchParams({ reason: sessionExpiredReason });
  const fromPath = typeof window.location.pathname === "string"
    ? window.location.pathname
    : "";

  if (fromPath && fromPath !== defaultLoginPath) {
    searchParams.set("from", fromPath);
  }

  window.location.replace(`${defaultLoginPath}?${searchParams.toString()}`);
};

const requestSessionRefresh = async (refreshPath) => {
  if (!inFlightRefreshRequest) {
    inFlightRefreshRequest = fetch(refreshPath, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        inFlightRefreshRequest = null;
      });
  }

  return inFlightRefreshRequest;
};

/**
 * Fetches a protected admin route and retries once after session refresh on 401.
 *
 * @param {string | URL} input
 * @param {RequestInit=} init
 * @param {{
 *   retryOn401Once?: boolean;
 *   refreshPath?: string;
 * }=} options
 * @returns {Promise<Response>}
 */
export const fetchProtectedAdminRoute = async (
  input,
  init,
  options
) => {
  const {
    retryOn401Once = true,
    refreshPath = defaultRefreshPath
  } = options ?? {};

  const initialResponse = await fetch(input, init);
  const isProtectedRequest = isProtectedAdminApiRequest(input);

  if (
    !isProtectedRequest ||
    initialResponse.status !== 401
  ) {
    return initialResponse;
  }

  if (!retryOn401Once) {
    redirectToLoginOnUnauthorized();
    return initialResponse;
  }

  const refreshSucceeded = await requestSessionRefresh(refreshPath);

  if (!refreshSucceeded) {
    redirectToLoginOnUnauthorized();
    return initialResponse;
  }

  const retriedResponse = await fetch(input, init);

  if (retriedResponse.status === 401) {
    redirectToLoginOnUnauthorized();
  }

  return retriedResponse;
};

/**
 * Test-only helper for resetting module-level state.
 */
export const __resetProtectedRouteFetchStateForTests = () => {
  inFlightRefreshRequest = null;
  hasTriggeredSessionRedirect = false;
};
