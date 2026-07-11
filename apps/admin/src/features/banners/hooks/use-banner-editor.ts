"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import {
  createBannerEditorTelemetryHooks,
  trackApiFailure
} from "@/lib/observability/telemetry";

import { bannerEditorDefaultValues } from "../defaults";
import { bannerEditorSchema, type BannerEditorSchemaValues } from "../schemas/banner.schema";
import { toBannerRequestPayload, toBannerEditorDefaults } from "../transformers";
import type {
  BannerEditorMode,
  BannerMutationAction,
  BannerRecord,
  BannerRouteError
} from "../types/banner.types";
import { useBannerById } from "./use-banner-by-id";
import { useCreateBanner } from "./use-create-banner";
import { useUploadBannerImage } from "./use-upload-banner-image";
import { useUpdateBanner } from "./use-update-banner";

type UseBannerEditorOptions = {
  id: string | undefined;
  mode: BannerEditorMode;
};

const parseBannerId = (id: string | undefined): number | null => {
  if (!id) {
    return null;
  }

  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const normalizeError = (error: unknown): BannerRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as BannerRouteError;
  }

  return {
    status: 500,
    title: "Request Failed",
    detail: "Unable to complete this operation."
  };
};

const toTelemetryReason = (error: BannerRouteError): string =>
  `${error.status}:${error.title}`;

const toBase64Payload = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Invalid file reader result."));
        return;
      }

      const [, base64Payload = ""] = reader.result.split(",", 2);

      if (!base64Payload) {
        reject(new Error("Empty image payload."));
        return;
      }

      resolve(base64Payload);
    };

    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });

export function useBannerEditor({ mode, id }: UseBannerEditorOptions) {
  const router = useRouter();
  const bannerId = parseBannerId(id);
  const [submitError, setSubmitError] = useState<BannerRouteError | null>(null);
  const [activeAction, setActiveAction] = useState<BannerMutationAction | null>(null);
  const [hasPendingNavigation, setHasPendingNavigation] = useState(false);
  const telemetry = useMemo(
    () => createBannerEditorTelemetryHooks(mode === "new" ? "create" : "edit"),
    [mode]
  );

  const bannerQuery = useBannerById(mode === "edit" ? bannerId : null);
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const uploadBannerImageMutation = useUploadBannerImage();

  const form = useForm<BannerEditorSchemaValues>({
    resolver: zodResolver(bannerEditorSchema),
    defaultValues: bannerEditorDefaultValues
  });

  useEffect(() => {
    if (!bannerQuery.data) {
      return;
    }

    form.reset(toBannerEditorDefaults(bannerQuery.data));
  }, [bannerQuery.data, form]);

  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || hasPendingNavigation) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => window.removeEventListener("beforeunload", beforeUnloadHandler);
  }, [form.formState.isDirty, hasPendingNavigation]);

  const loadError =
    bannerQuery.error && mode === "edit" ? normalizeError(bannerQuery.error) : null;

  useEffect(() => {
    if (!loadError) {
      return;
    }

    const reason = toTelemetryReason(loadError);

    trackApiFailure({
      module: "banners",
      action: "detail",
      endpoint: "/api/admin/banners/{id}",
      method: "GET",
      error: loadError,
      fallbackStatus: loadError.status,
      ...(loadError.traceId ? { traceId: loadError.traceId } : {})
    });

    telemetry.onDetailFailure({
      status: loadError.status,
      ...(loadError.traceId ? { traceId: loadError.traceId } : {}),
      reason
    });
  }, [loadError, telemetry]);

  const navigateToBanners = () => {
    setHasPendingNavigation(true);
    router.replace(appRoutes.banners);
    router.refresh();
  };

  const handleNavigateBack = () => {
    if (form.formState.isDirty) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Leave this editor without saving?"
      );

      if (!shouldLeave) {
        return;
      }
    }

    navigateToBanners();
  };

  const handleMutationSuccess = (
    action: BannerMutationAction,
    traceId?: string,
    status?: number
  ) => {
    setSubmitError(null);
    setActiveAction(null);

    if (action === "publish") {
      telemetry.onPublishSuccess({
        ...(traceId ? { traceId } : {}),
        ...(typeof status === "number" ? { status } : {})
      });
    } else {
      telemetry.onSaveDraftSuccess({
        ...(traceId ? { traceId } : {}),
        ...(typeof status === "number" ? { status } : {})
      });
    }

    navigateToBanners();
  };

  const handleMutationError = (action: BannerMutationAction, error: unknown) => {
    const normalizedError = normalizeError(error);
    const reason = toTelemetryReason(normalizedError);

    setSubmitError(normalizedError);
    setActiveAction(null);

    trackApiFailure({
      module: "banners",
      action: mode === "new" ? "create" : "update",
      endpoint: mode === "new" ? "/api/admin/banners" : "/api/admin/banners/{id}",
      method: mode === "new" ? "POST" : "PUT",
      error: normalizedError,
      fallbackStatus: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
    });

    if (action === "publish") {
      telemetry.onPublishFailure({
        status: normalizedError.status,
        ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {}),
        reason
      });
      return;
    }

    telemetry.onSaveDraftFailure({
      status: normalizedError.status,
      ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {}),
      reason
    });
  };

  const submitAction = (action: BannerMutationAction) =>
    form.handleSubmit((values) => {
      const payload = toBannerRequestPayload({
        mode,
        values,
        action,
        existingBanner: bannerQuery.data ?? null
      });

      setSubmitError(null);
      setActiveAction(action);

      if (mode === "new") {
        createBannerMutation.mutate(payload, {
          onError: (error) => handleMutationError(action, error),
          onSuccess: (result) => {
            handleMutationSuccess(action, result.traceId, result.status);
          }
        });
        return;
      }

      if (!bannerId) {
        handleMutationError(action, {
          status: 400,
          title: "Bad Request",
          detail: "Invalid banner id."
        } satisfies BannerRouteError);
        return;
      }

      updateBannerMutation.mutate(
        { id: bannerId, payload },
        {
          onError: (error) => handleMutationError(action, error),
          onSuccess: (result) => {
            handleMutationSuccess(action, result.traceId, result.status);
          }
        }
      );
    });

  const handleSelectImage = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("urlImage", {
        type: "validate",
        message: "Select a valid image file."
      });
      return;
    }

    form.clearErrors("urlImage");
    setSubmitError(null);

    try {
      const base64 = await toBase64Payload(file);
      const result = await uploadBannerImageMutation.mutateAsync({
        base64,
        fileName: file.name
      });

      form.setValue("urlImage", result.imageUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    } catch (error) {
      const normalizedError = normalizeError(error);

      form.setError("urlImage", {
        type: "server",
        message: normalizedError.detail
      });
    }
  };

  return {
    activeAction,
    activeStatus: bannerQuery.data?.active ?? false,
    banner: bannerQuery.data as BannerRecord | null | undefined,
    form,
    handleNavigateBack,
    handleSelectImage,
    isInvalidBannerId: mode === "edit" && !bannerId,
    isLoading: mode === "edit" && bannerQuery.isLoading,
    isUploadingImage: uploadBannerImageMutation.isPending,
    isSubmitting: createBannerMutation.isPending || updateBannerMutation.isPending,
    loadError,
    mode,
    retryLoad: () => bannerQuery.refetch(),
    submitAction,
    submitError
  };
}
