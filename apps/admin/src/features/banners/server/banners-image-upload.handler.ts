import { NextResponse } from "next/server";

import { uploadBannerImageInBackend } from "@/lib/api/banners-admin-api";
import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";
import {
  addSentryBreadcrumb,
  captureException,
  logger,
  observabilityEvents
} from "@/lib/observability";

import { parseBannerImageUploadResult } from "../parsers";
import { createBannersErrorResponse } from "./banners-error-response";

const ENDPOINT = "/api/v1/admin/images/upload";

type BannerImageUploadPayload = {
  fileName: string;
  base64: string;
};

const isUploadPayload = (
  value: unknown
): value is BannerImageUploadPayload =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as { fileName?: unknown }).fileName === "string" &&
  typeof (value as { base64?: unknown }).base64 === "string";

export async function bannersImageUploadHandler(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  addSentryBreadcrumb("Admin banner image upload request", {
    category: "banners",
    data: { module: "banners", action: "upload-image" }
  });

  try {
    const requestBody = await request.json();

    if (!isUploadPayload(requestBody)) {
      return createBannersErrorResponse({
        status: 400,
        title: "Bad Request",
        detail: "Image upload requires a file name and base64 payload.",
        setCookieHeaders: []
      });
    }

    const backendResult = await uploadBannerImageInBackend({
      cookieHeader,
      fileName: requestBody.fileName,
      base64: requestBody.base64
    });

    if ("error" in backendResult) {
      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "banners",
        action: "upload-image",
        endpoint: ENDPOINT,
        status: backendResult.error.status,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      });

      return createBannersErrorResponse({
        status: backendResult.error.status,
        title: backendResult.error.title,
        detail: backendResult.error.detail,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {}),
        setCookieHeaders: backendResult.setCookieHeaders
      });
    }

    const uploadedImage = parseBannerImageUploadResult(backendResult.data);

    if (!uploadedImage) {
      const resultPayload =
        typeof backendResult.data === "object" && backendResult.data !== null
          ? backendResult.data
          : null;
      const uploadErrorDetail =
        resultPayload &&
        "error" in resultPayload &&
        typeof resultPayload.error === "object" &&
        resultPayload.error !== null &&
        "message" in resultPayload.error &&
        typeof (resultPayload.error as { message?: unknown }).message === "string"
          ? (resultPayload.error as { message: string }).message
          : "The image upload completed without returning an image URL.";

      return createBannersErrorResponse({
        status: 502,
        title: "Upload Error",
        detail: uploadErrorDetail,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {}),
        setCookieHeaders: backendResult.setCookieHeaders
      });
    }

    logger.info(observabilityEvents.bannersActionExecuted, {
      module: "banners",
      action: "upload-image",
      status: backendResult.status,
      ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
    });

    const response = NextResponse.json(
      {
        ok: true,
        data: uploadedImage,
        ...(backendResult.traceId ? { traceId: backendResult.traceId } : {})
      },
      { status: backendResult.status }
    );

    appendSetCookieHeaders(response, backendResult.setCookieHeaders);
    return response;
  } catch (error) {
    logger.error(observabilityEvents.apiRequestFailed, {
      module: "banners",
      action: "upload-image",
      endpoint: ENDPOINT,
      status: 503
    });

    captureException(error, {
      scope: {
        tags: { module: "banners", action: "upload-image" },
        level: "error"
      },
      context: { endpoint: ENDPOINT, status: 503 }
    });

    return createBannersErrorResponse({
      status: 503,
      title: "Service Unavailable",
      detail: "Unable to upload this banner image right now.",
      setCookieHeaders: []
    });
  }
}
