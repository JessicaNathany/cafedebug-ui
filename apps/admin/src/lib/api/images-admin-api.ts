import type { UploadImageRequest } from "@cafedebug/api-client";

import { getAdminApiClient } from "./admin-client";
import {
  type BackendApiResult,
  withBackendAuthHeaders,
  toConfigurationErrorResult,
  normalizeBackendResult
} from "./backend-api.utils";

export type ImageUploadInput = UploadImageRequest;

export type BackendImageApiResult = BackendApiResult;

export const uploadImageInBackend = async ({
  cookieHeader,
  payload
}: {
  cookieHeader: string;
  payload: ImageUploadInput;
}): Promise<BackendImageApiResult> => {
  const adminClient = getAdminApiClient();

  if (!adminClient) {
    return toConfigurationErrorResult();
  }

  const response = await adminClient.images.upload(payload, {
    headers: withBackendAuthHeaders(cookieHeader)
  });

  return normalizeBackendResult(response);
};
