"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import {
  parseBannerImageUploadResult,
  parseBannerMutationResult,
  parseBannerRecord,
  parseBannersPageData
} from "../parsers";
import type {
  BannerImageUploadResult,
  BannerMutationResult,
  BannerRequestPayload,
  BannerRouteError,
  BannersQueryParams
} from "../types/banner.types";

type ApiEnvelope<TData> =
  | {
      ok: true;
      data: TData;
      status: number;
      traceId?: string;
    }
  | {
      ok: false;
      error: BannerRouteError;
    };

const parseJson = async <TData>(response: Response): Promise<TData | undefined> => {
  try {
    return (await response.json()) as TData;
  } catch {
    return undefined;
  }
};

const toRouteError = (payload: unknown, fallbackStatus: number): BannerRouteError => {
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

const fetchBannerApi = async <TData>(
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
    status: response.status,
    ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {})
  };
};

const toSearchParams = (params: BannersQueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(params.page));
  queryParams.set("pageSize", String(params.pageSize));
  queryParams.set("sortBy", params.sortBy);
  queryParams.set("descending", String(params.descending));
  return queryParams;
};

export const bannersQueryKeys = Object.freeze({
  all: ["banners"] as const,
  list: (params: BannersQueryParams) => ["banners", "list", params] as const,
  detail: (id: number) => ["banners", "detail", id] as const
});

export const fetchBannersPage = async (params: BannersQueryParams) => {
  const searchParams = toSearchParams(params).toString();
  const response = await fetchBannerApi<unknown>(`/api/admin/banners?${searchParams}`);

  if (!response.ok) {
    throw response.error;
  }

  return parseBannersPageData(response.data, params);
};

export const fetchBannerById = async (id: number) => {
  const response = await fetchBannerApi<unknown>(`/api/admin/banners/${id}`);

  if (!response.ok) {
    throw response.error;
  }

  const banner = parseBannerRecord(response.data, id);

  if (!banner) {
    throw {
      status: 404,
      title: "Banner not found",
      detail: "Unable to parse banner payload.",
      ...(response.traceId ? { traceId: response.traceId } : {})
    } satisfies BannerRouteError;
  }

  return banner;
};

export const createBanner = async (
  payload: BannerRequestPayload
): Promise<BannerMutationResult> => {
  const response = await fetchBannerApi<unknown>("/api/admin/banners", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  return {
    ...parseBannerMutationResult(response.data),
    status: response.status,
    ...(response.traceId ? { traceId: response.traceId } : {})
  };
};

export const updateBanner = async ({
  id,
  payload
}: {
  id: number;
  payload: BannerRequestPayload;
}): Promise<BannerMutationResult> => {
  const response = await fetchBannerApi<unknown>(`/api/admin/banners/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw response.error;
  }

  return {
    ...parseBannerMutationResult(response.data, id),
    status: response.status,
    ...(response.traceId ? { traceId: response.traceId } : {})
  };
};

export const uploadBannerImage = async ({
  base64,
  fileName
}: {
  base64: string;
  fileName: string;
}): Promise<BannerImageUploadResult> => {
  const response = await fetchBannerApi<unknown>("/api/admin/images/upload", {
    method: "POST",
    body: JSON.stringify({ base64, fileName, imageFolder: "banners" })
  });

  if (!response.ok) {
    throw response.error;
  }

  const uploadedImage = parseBannerImageUploadResult(response.data);

  if (!uploadedImage) {
    throw {
      status: 502,
      title: "Upload Failed",
      detail: "Unable to parse the uploaded image response.",
      ...(response.traceId ? { traceId: response.traceId } : {})
    } satisfies BannerRouteError;
  }

  return {
    ...uploadedImage,
    status: response.status,
    ...(response.traceId ? { traceId: response.traceId } : {})
  };
};
