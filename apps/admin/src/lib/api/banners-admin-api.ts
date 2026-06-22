import type { BannerRequest, UploadImageRequest } from "@cafedebug/api-client";
import { ImageFolder } from "@cafedebug/api-client";

import type { BannerRequestPayload } from "@/features/banners/types/banner.types";

import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  normalizeBackendResult,
  toConfigurationErrorResult,
  withBackendAuthHeaders
} from "./backend-api.utils";

export type BackendBannersQuery = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
};

export type BannerMutationInput = BannerRequestPayload;
export type BackendBannerApiResult = BackendApiResult;
export type BackendBannerImageUploadResult = BackendApiResult<{
  value?: {
    imageUrl?: string | null;
  };
}>;

export const listBannersFromBackend = async ({
  cookieHeader,
  query
}: {
  cookieHeader: string;
  query: BackendBannersQuery;
}): Promise<BackendBannerApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.banners.list(query, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const getBannerFromBackend = async ({
  cookieHeader,
  id
}: {
  cookieHeader: string;
  id: number;
}): Promise<BackendBannerApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.banners.get(id, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const createBannerInBackend = async ({
  cookieHeader,
  payload
}: {
  cookieHeader: string;
  payload: BannerMutationInput;
}): Promise<BackendBannerApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.banners.create(payload as BannerRequest, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const updateBannerInBackend = async ({
  cookieHeader,
  id,
  payload
}: {
  cookieHeader: string;
  id: number;
  payload: BannerMutationInput;
}): Promise<BackendBannerApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.banners.update(id, payload as BannerRequest, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};

export const uploadBannerImageInBackend = async ({
  cookieHeader,
  fileName,
  base64
}: {
  cookieHeader: string;
  fileName: string;
  base64: string;
}): Promise<BackendBannerImageUploadResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const payload: UploadImageRequest = {
    fileName,
    base64,
    imageFolder: ImageFolder.banners
  };

  const response = await adminClient.images.upload(payload, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};
