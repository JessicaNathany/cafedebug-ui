"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import type { AdminRouteError } from "@/features/episodes/types/episode.types";

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml"
] as const;

export type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number];

export type UploadedImage = { imageUrl: string };

type UploadResponseEnvelope = {
  ok?: boolean;
  data?: {
    imageUrl?: string | null;
    value?: { imageUrl?: string | null };
  };
  error?: {
    status?: number;
    title?: string;
    detail?: string;
    traceId?: string;
  };
  traceId?: string;
};

const parseJson = async (response: Response): Promise<UploadResponseEnvelope | undefined> => {
  try {
    return (await response.json()) as UploadResponseEnvelope;
  } catch {
    return undefined;
  }
};

const toRouteError = (
  envelope: UploadResponseEnvelope | undefined,
  fallbackStatus: number
): AdminRouteError => {
  const error = envelope?.error;

  if (error) {
    return {
      status: typeof error.status === "number" ? error.status : fallbackStatus,
      title:
        typeof error.title === "string" && error.title.trim().length > 0
          ? error.title
          : "Upload Failed",
      detail:
        typeof error.detail === "string" && error.detail.trim().length > 0
          ? error.detail
          : "Unable to upload the image.",
      ...(typeof error.traceId === "string" && error.traceId.trim().length > 0
        ? { traceId: error.traceId }
        : {})
    };
  }

  return {
    status: fallbackStatus,
    title: "Upload Failed",
    detail: "Unable to upload the image."
  };
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(reader.error ?? new Error("Unable to read the selected file."));
    };

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected file."));
    };

    reader.readAsDataURL(file);
  });

export const uploadEpisodeImage = async (file: File): Promise<UploadedImage> => {
  const base64 = await fileToDataUrl(file);

  const response = await fetchProtectedAdminRoute("/api/admin/images/upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      base64,
      fileName: file.name,
      imageFolder: "episodes"
    })
  });

  const envelope = await parseJson(response);

  if (!response.ok || envelope?.ok === false) {
    throw toRouteError(envelope, response.status);
  }

  const imageUrl =
    envelope?.data?.imageUrl ?? envelope?.data?.value?.imageUrl ?? null;

  if (typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    throw {
      status: 502,
      title: "Upload Failed",
      detail: "The upload service did not return an image URL."
    } satisfies AdminRouteError;
  }

  return { imageUrl };
};
