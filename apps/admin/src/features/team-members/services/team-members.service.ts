"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import { parseTeamMembersPageData } from "../parsers";
import type {
  TeamMembersPageData,
  TeamMembersQueryParams,
  TeamMembersRouteError
} from "../types/team-member.types";

type ApiEnvelope<TData> =
  | {
      ok: true;
      data: TData;
      traceId?: string;
    }
  | {
      ok: false;
      error: TeamMembersRouteError;
    };

const parseJson = async <TData>(response: Response): Promise<TData | undefined> => {
  try {
    return (await response.json()) as TData;
  } catch {
    return undefined;
  }
};

const toRouteError = (payload: unknown, fallbackStatus: number): TeamMembersRouteError => {
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
        typeof error.title === "string" && error.title.trim().length > 0
          ? error.title
          : "Request Failed",
      detail:
        typeof error.detail === "string" && error.detail.trim().length > 0
          ? error.detail
          : "Request failed.",
      ...(typeof error.traceId === "string" && error.traceId.trim().length > 0
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

const fetchTeamMembersApi = async <TData>(
  input: string | URL,
  init?: RequestInit
): Promise<ApiEnvelope<TData>> => {
  const response = await fetchProtectedAdminRoute(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await parseJson<unknown>(response);

  if (!response.ok) {
    return {
      ok: false,
      error: toRouteError(payload, response.status)
    };
  }

  const envelope =
    payload as
      | {
          data?: TData;
          traceId?: string;
        }
      | undefined;

  return {
    ok: true,
    data: (envelope?.data as TData) ?? ({} as TData),
    ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {})
  };
};

const toSearchParams = (params: TeamMembersQueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(params.page));
  queryParams.set("pageSize", String(params.pageSize));
  queryParams.set("sortBy", params.sortBy);
  queryParams.set("descending", String(params.descending));
  if (params.search) {
    queryParams.set("search", params.search);
  }

  return queryParams;
};

export const teamMembersQueryKeys = Object.freeze({
  all: ["team-members"] as const,
  list: (params: TeamMembersQueryParams) => ["team-members", "list", params] as const
});

export const fetchTeamMembersPage = async (
  params: TeamMembersQueryParams
): Promise<TeamMembersPageData> => {
  const searchParams = toSearchParams(params).toString();
  const response = await fetchTeamMembersApi<unknown>(`/api/admin/team-members?${searchParams}`);

  if (!response.ok) {
    throw response.error;
  }

  return parseTeamMembersPageData(response.data, params);
};