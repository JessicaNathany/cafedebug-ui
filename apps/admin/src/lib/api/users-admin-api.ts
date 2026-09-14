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
  createdAt?: string;
};

export type BackendUsersApiResult = BackendApiResult;

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
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

  const url = `${adminRuntimeEnv.apiBaseUrl}${path}`;
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
    return normalizeBackendResult({ data, status: response.status, headers: response.headers });
  } catch {
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

  return callUsersBackend({
    cookieHeader,
    path: `/api/v1/admin/users?${searchParams.toString()}`,
    method: "GET"
  });
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
