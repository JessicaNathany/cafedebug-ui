import { NextResponse } from "next/server";

import type { ImageFolder, UploadImageRequest } from "@cafedebug/api-client";

import { uploadImageInBackend } from "@/lib/api/images-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { createImagesErrorResponse } from "./images-error-response";

const ENDPOINT = "/api/v1/admin/images/upload";

const ALLOWED_IMAGE_FOLDERS: ReadonlySet<string> = new Set([
  "episodes",
  "banners",
  "teamMembers",
  "contributors"
]);

type UploadRequestBody = {
  base64?: unknown;
  fileName?: unknown;
  imageFolder?: unknown;
};

const toNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

export async function imagesUploadHandler(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  addSentryBreadcrumb("Admin image upload request", {
    category: "images",
    data: { module: "images", action: "upload" }
  });

  let body: UploadRequestBody;
  try {
    body = (await request.json()) as UploadRequestBody;
  } catch {
    return createImagesErrorResponse({
      status: 400,
      title: "Bad Request",
      detail: "Request body must be valid JSON.",
      setCookieHeaders: []
    });
  }

  const base64 = toNonEmptyString(body.base64);
  const fileName = toNonEmptyString(body.fileName);
  const imageFolder = toNonEmptyString(body.imageFolder);

  if (!base64 || !fileName || !imageFolder || !ALLOWED_IMAGE_FOLDERS.has(imageFolder)) {
    return createImagesErrorResponse({
      status: 400,
      title: "Bad Request",
      detail: "Missing or invalid image upload fields.",
      setCookieHeaders: []
    });
  }

  const payload: UploadImageRequest = {
    base64,
    fileName,
    imageFolder: imageFolder as ImageFolder
  };

  try {
    const backendResult = await uploadImageInBackend({ cookieHeader, payload });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "images",
        action: "upload",
        endpoint: ENDPOINT,
        status: backendResult.error.status,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      });

      return createImagesErrorResponse({
        status: backendResult.error.status,
        title: backendResult.error.title,
        detail: backendResult.error.detail,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {}),
        setCookieHeaders: backendResult.setCookieHeaders
      });
    }

    logger.info(observabilityEvents.imagesActionExecuted, {
      module: "images",
      action: "upload",
      status: backendResult.status,
      ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
    });

    const response = NextResponse.json(
      {
        ok: true,
        data: backendResult.data,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      },
      { status: backendResult.status }
    );

    appendSetCookieHeaders(response, backendResult.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, {
      module: "images",
      action: "upload",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: { tags: { module: "images", action: "upload" }, level: "error" },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createImagesErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to upload the image right now.",
      setCookieHeaders: []
    });
  }
}
