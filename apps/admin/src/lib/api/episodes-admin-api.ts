import type { EpisodeRequest } from "@cafedebug/api-client";

import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  withBackendAuthHeaders,
  toConfigurationErrorResult,
  normalizeBackendResult
} from "./backend-api.utils";

export type BackendEpisodesQuery = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
  search?: string;
};

export type EpisodeMutationInput = EpisodeRequest;

export type BackendEpisodeApiResult = BackendApiResult;

export const listEpisodesFromBackend = async ({
  cookieHeader,
  query
}: {
  cookieHeader: string;
  query: BackendEpisodesQuery;
}): Promise<BackendEpisodeApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.episodes.list(query, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const getEpisodeFromBackend = async ({
  cookieHeader,
  id
}: {
  cookieHeader: string;
  id: number;
}): Promise<BackendEpisodeApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.episodes.get(id, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const createEpisodeInBackend = async ({
  cookieHeader,
  payload
}: {
  cookieHeader: string;
  payload: EpisodeMutationInput;
}): Promise<BackendEpisodeApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.episodes.create(payload, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const updateEpisodeInBackend = async ({
  cookieHeader,
  id,
  payload
}: {
  cookieHeader: string;
  id: number;
  payload: EpisodeMutationInput;
}): Promise<BackendEpisodeApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.episodes.update(id, payload, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};
