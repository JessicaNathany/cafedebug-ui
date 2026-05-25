"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import type {
  AdminRouteError,
  EpisodeRequestPayload,
  EpisodesMutationResult,
  EpisodesQueryParams
} from "../types/episode.types";
import {
  parseEpisodeMutationResult,
  parseEpisodeRecord,
  parseEpisodesPageData
} from "../parsers";

type ApiEnvelope<TData> =
  | {
      ok: true;
      data: TData;
      traceId?: string;
    }
  | {
      ok: false;
      error: AdminRouteError;
    };

const parseJson = async <TData>(response: Response): Promise<TData | undefined> => {
  try {
    return (await response.json()) as TData;
  } catch {
    return undefined;
  }
};

const toRouteError = (
  payload: unknown,
  fallbackStatus: number
): AdminRouteError => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "object"
  ) {
    const error = (payload as { error: Record<string, unknown> }).error;

    return {
      status:
        typeof error.status === "number" ? error.status : fallbackStatus,
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

const fetchEpisodeApi = async <TData>(
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

  const envelope = payload as
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

const toSearchParams = (params: EpisodesQueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(params.page));
  queryParams.set("pageSize", String(params.pageSize));
  queryParams.set("sortBy", params.sortBy);
  queryParams.set("descending", String(params.descending));
  if (params.search) queryParams.set("search", params.search);

  return queryParams;
};

export const episodesQueryKeys = Object.freeze({
  all: ["episodes"] as const,
  list: (params: EpisodesQueryParams) => ["episodes", params] as const,
  detail: (id: number) => ["episode", id] as const
});

export const fetchEpisodesPage = async (params: EpisodesQueryParams) => {
  const searchParams = toSearchParams(params).toString();
  const response = await fetchEpisodeApi<unknown>(
    `/api/admin/episodes?${searchParams}`
  );

  if (!response.ok) {
    throw response.error;
  }

  return parseEpisodesPageData(response.data, params);
};

export const fetchEpisodeById = async (id: number) => {
  const response = await fetchEpisodeApi<unknown>(`/api/admin/episodes/${id}`);

  if (!response.ok) {
    throw response.error;
  }

  const episode = parseEpisodeRecord(response.data, id);

  if (!episode) {
    throw {
      status: 404,
      title: "Episode not found",
      detail: "Unable to parse episode payload."
    } satisfies AdminRouteError;
  }

  return episode;
};

export const createEpisode = async (
  payload: EpisodeRequestPayload
): Promise<EpisodesMutationResult> => {
  const response = await fetchEpisodeApi<unknown>("/api/admin/episodes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  return parseEpisodeMutationResult(response.data);
};

export const updateEpisode = async ({
  id,
  payload
}: {
  id: number;
  payload: EpisodeRequestPayload;
}): Promise<EpisodesMutationResult> => {
  const response = await fetchEpisodeApi<unknown>(`/api/admin/episodes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  return parseEpisodeMutationResult(response.data);
};
