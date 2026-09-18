import { normalizeApiError } from "@cafedebug/api-client";

import { adminRuntimeEnv } from "@/lib/env";

import {
  type BackendApiResult,
  normalizeBackendResult,
  toConfigurationErrorResult,
  withBackendAuthHeaders
} from "./backend-api.utils";

export type BackendUsersQuery = {
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
  search?: string;
};

export type UserMutationInput = {
  name: string;
  email: string;
  password?: string;
};

export type BackendUsersApiResult = BackendApiResult;

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const resolveUsersFallbackBaseUrl = (): string | null => {
  const primaryBaseUrl = adminRuntimeEnv.apiBaseUrl.trim();
  if (!primaryBaseUrl) {
    return null;
  }

  try {
    const url = new URL(primaryBaseUrl);
    const isLocalhost =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isLegacyPort = url.port === "8080";

    if (!isLocalhost || !isLegacyPort) {
      return null;
    }

    const fallbackUrl = new URL(primaryBaseUrl);
    fallbackUrl.port = "5105";
    return fallbackUrl.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};

const callUsersBackend = async ({
  cookieHeader,
  path,
  method,
  payload
}: {
  cookieHeader: string;
  path: string;
  method: "GET" | "POST" | "PUT";
  payload?: UserMutationInput;
}): Promise<BackendUsersApiResult> => {
  if (!adminRuntimeEnv.apiBaseUrl) {
    return toConfigurationErrorResult();
  }

  const primaryBaseUrl = adminRuntimeEnv.apiBaseUrl.replace(/\/$/, "");
  const fallbackBaseUrl = resolveUsersFallbackBaseUrl();
  const url = `${primaryBaseUrl}${path}`;
  const headers = withBackendAuthHeaders(cookieHeader);

  const requestInit: RequestInit = {
    method,
    headers: {
      ...headers,
      ...(payload ? { "content-type": "application/json" } : {})
    },
    ...(payload ? { body: JSON.stringify(payload) } : {})
  };

  try {
    const response = await fetch(url, requestInit);
    const data = await parseJson(response);
    const primaryResult = normalizeBackendResult({
      data,
      status: response.status,
      headers: response.headers
    });

    if (
      fallbackBaseUrl &&
      "error" in primaryResult &&
      (primaryResult.status === 404 || primaryResult.status === 405)
    ) {
      const fallbackResponse = await fetch(`${fallbackBaseUrl}${path}`, requestInit);
      const fallbackData = await parseJson(fallbackResponse);
      return normalizeBackendResult({
        data: fallbackData,
        status: fallbackResponse.status,
        headers: fallbackResponse.headers
      });
    }

    return primaryResult;
  } catch {
    if (fallbackBaseUrl) {
      try {
        const fallbackResponse = await fetch(`${fallbackBaseUrl}${path}`, requestInit);
        const fallbackData = await parseJson(fallbackResponse);
        return normalizeBackendResult({
          data: fallbackData,
          status: fallbackResponse.status,
          headers: fallbackResponse.headers
        });
      } catch {
        // Fallback failed; return service unavailable below.
      }
    }

    return {
      error: normalizeApiError(
        {
          status: 503,
          title: "Service Unavailable",
          detail: "Unable to reach users backend service."
        },
        503
      ),
      status: 503,
      headers: new Headers(),
      setCookieHeaders: []
    };
  }
};

export const listUsersFromBackend = async ({
  cookieHeader,
  query
}: {
  cookieHeader: string;
  query: BackendUsersQuery;
}): Promise<BackendUsersApiResult> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(query.page));
  searchParams.set("pageSize", String(query.pageSize));
  searchParams.set("sortBy", query.sortBy);
  searchParams.set("descending", String(query.descending));
  if (query.search) {
    searchParams.set("search", query.search);
  }

  const result = await callUsersBackend({
    cookieHeader,
    path: `/api/v1/admin/users?${searchParams.toString()}`,
    method: "GET"
  });

  if ("error" in result && result.status === 400) {
    return callUsersBackend({
      cookieHeader,
      path: "/api/v1/admin/users",
      method: "GET"
    });
  }

  return result;
};

export const getUserFromBackend = async ({
  cookieHeader,
  id
}: {
  cookieHeader: string;
  id: number;
}): Promise<BackendUsersApiResult> =>
  callUsersBackend({
    cookieHeader,
    path: `/api/v1/admin/users/${id}`,
    method: "GET"
  });

export const createUserInBackend = async ({
  cookieHeader,
  payload
}: {
  cookieHeader: string;
  payload: UserMutationInput;
}): Promise<BackendUsersApiResult> =>
  callUsersBackend({
    cookieHeader,
    path: "/api/v1/admin/users",
    method: "POST",
    payload
  });

export const updateUserInBackend = async ({
  cookieHeader,
  id,
  payload
}: {
  cookieHeader: string;
  id: number;
  payload: UserMutationInput;
}): Promise<BackendUsersApiResult> =>
  callUsersBackend({
    cookieHeader,
    path: `/api/v1/admin/users/${id}`,
    method: "PUT",
    payload
  });
