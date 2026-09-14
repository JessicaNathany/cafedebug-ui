"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import { parseUserRecord, parseUsersPageData } from "../parsers";
import type {
  UserMutationPayload,
  UserRecord,
  UsersPageData,
  UsersQueryParams,
  UsersRouteError
} from "../types/users.types";

type ApiEnvelope<TData> =
  | { ok: true; data: TData; traceId?: string }
  | { ok: false; error: UsersRouteError };

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const toRouteError = (payload: unknown, fallbackStatus: number): UsersRouteError => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "object"
  ) {
    const error = (payload as { error: Record<string, unknown> }).error;
    return {
      status: typeof error.status === "number" ? error.status : fallbackStatus,
      title:
        typeof error.title === "string" && error.title.trim()
          ? error.title
          : "Request Failed",
      detail:
        typeof error.detail === "string" && error.detail.trim()
          ? error.detail
          : "Request failed.",
      ...(typeof error.traceId === "string" && error.traceId.trim()
        ? { traceId: error.traceId }
        : {})
    };
  }

  return {
    status: fallbackStatus,
    title: "Request Failed",
    detail: "Unable to complete the request."
  };
};

const fetchUsersApi = async <TData>(
  input: string,
  init?: RequestInit
): Promise<ApiEnvelope<TData>> => {
  const response = await fetchProtectedAdminRoute(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    return { ok: false, error: toRouteError(payload, response.status) };
  }

  const envelope = payload as { data?: TData; traceId?: string } | undefined;

  return {
    ok: true,
    data: (envelope?.data as TData) ?? ({} as TData),
    ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {})
  };
};

const toSearchParams = (params: UsersQueryParams): URLSearchParams => {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  query.set("sortBy", params.sortBy);
  query.set("descending", String(params.descending));
  if (params.search) {
    query.set("search", params.search);
  }
  return query;
};

export const usersQueryKeys = Object.freeze({
  all: ["users"] as const,
  list: (params: UsersQueryParams) => ["users", "list", params] as const,
  detail: (id: number) => ["users", "detail", id] as const
});

export const fetchUsersPage = async (
  params: UsersQueryParams
): Promise<UsersPageData> => {
  const response = await fetchUsersApi<unknown>(
    `/api/admin/users?${toSearchParams(params)}`
  );

  if (!response.ok) {
    throw response.error;
  }

  return parseUsersPageData(response.data, params);
};

export const fetchUserById = async (id: number): Promise<UserRecord> => {
  const response = await fetchUsersApi<unknown>(`/api/admin/users/${id}`);

  if (!response.ok) {
    throw response.error;
  }

  const record = parseUserRecord(response.data, id);

  if (!record) {
    throw {
      status: 404,
      title: "User not found",
      detail: "Unable to parse the user record."
    } satisfies UsersRouteError;
  }

  return record;
};

export const createUser = async (payload: UserMutationPayload): Promise<UserRecord> => {
  const response = await fetchUsersApi<unknown>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  const record = parseUserRecord(response.data);

  if (!record) {
    throw {
      status: 503,
      title: "Invalid response",
      detail: "The created user response was invalid."
    } satisfies UsersRouteError;
  }

  return record;
};

export const updateUser = async ({
  id,
  payload
}: {
  id: number;
  payload: UserMutationPayload;
}): Promise<UserRecord> => {
  const response = await fetchUsersApi<unknown>(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  const record = parseUserRecord(response.data, id);

  if (!record) {
    throw {
      status: 503,
      title: "Invalid response",
      detail: "The updated user response was invalid."
    } satisfies UsersRouteError;
  }

  return record;
};
