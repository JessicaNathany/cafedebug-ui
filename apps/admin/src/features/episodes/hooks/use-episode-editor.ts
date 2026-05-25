"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import { logger, observabilityEvents } from "@/lib/observability";
import {
  createEpisodeEditorTelemetryHooks,
  trackApiFailure
} from "@/lib/observability/telemetry";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  uploadEpisodeImage
} from "@/features/images/services/images.service";

import { episodeEditorDefaultValues } from "../defaults";
import { useCreateEpisode } from "./use-create-episode";
import { useEpisodeById } from "./use-episode-by-id";
import { useUpdateEpisode } from "./use-update-episode";
import { episodeEditorSchema, type EpisodeEditorSchemaValues } from "../schemas/episode.schema";
import { toEpisodeEditorDefaults, toEpisodeRequestPayload } from "../transformers";
import type {
  AdminRouteError,
  EpisodeDisplayStatus,
  EpisodeMutationAction,
  EpisodeRecord
} from "../types/episode.types";

export type EpisodeEditorMode = "new" | "edit";

type UseEpisodeEditorOptions = {
  id: string | undefined;
  mode: EpisodeEditorMode;
};

const parseEpisodeId = (id: string | undefined): number | null => {
  if (!id) {
    return null;
  }

  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const normalizeError = (error: unknown): AdminRouteError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "title" in error &&
    "detail" in error
  ) {
    return error as AdminRouteError;
  }

  return {
    status: 500,
    title: "Request Failed",
    detail: "Unable to complete this operation."
  };
};

const toTelemetryReason = (error: AdminRouteError): string =>
  `${error.status}:${error.title}`;

const DATE_TIME_WITH_MINUTES_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE_TIME_WITH_SECONDS_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const DATE_TIME_EXTRACT_PATTERN =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

const formatDateInputValue = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (DATE_TIME_WITH_SECONDS_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (DATE_TIME_WITH_MINUTES_PATTERN.test(trimmedValue)) {
    return `${trimmedValue}:00`;
  }

  const extractedDateTime = DATE_TIME_EXTRACT_PATTERN.exec(trimmedValue);

  if (extractedDateTime) {
    const [, minutesValue, secondsValue] = extractedDateTime;
    return `${minutesValue}:${secondsValue ?? "00"}`;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedValue;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hour = String(parsedDate.getHours()).padStart(2, "0");
  const minute = String(parsedDate.getMinutes()).padStart(2, "0");
  const second = String(parsedDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

const toIsoDateTimeValue = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (DATE_TIME_WITH_SECONDS_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (DATE_TIME_WITH_MINUTES_PATTERN.test(trimmedValue)) {
    return `${trimmedValue}:00`;
  }

  const extractedDateTime = DATE_TIME_EXTRACT_PATTERN.exec(trimmedValue);

  if (extractedDateTime) {
    const [, minutesValue, secondsValue] = extractedDateTime;
    return `${minutesValue}:${secondsValue ?? "00"}`;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedValue;
  }

  return parsedDate.toISOString().slice(0, 19);
};

export function useEpisodeEditor({ mode, id }: UseEpisodeEditorOptions) {
  const router = useRouter();
  const episodeId = parseEpisodeId(id);
  const [submitError, setSubmitError] = useState<AdminRouteError | null>(null);
  const [activeAction, setActiveAction] = useState<EpisodeMutationAction | null>(null);
  const [hasPendingNavigation, setHasPendingNavigation] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileSelectionError, setFileSelectionError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const telemetry = useMemo(
    () => createEpisodeEditorTelemetryHooks(mode === "new" ? "create" : "edit"),
    [mode]
  );

  const episodeQuery = useEpisodeById(mode === "edit" ? episodeId : null);
  const createEpisodeMutation = useCreateEpisode();
  const updateEpisodeMutation = useUpdateEpisode();

  const form = useForm<EpisodeEditorSchemaValues>({
    resolver: zodResolver(episodeEditorSchema),
    defaultValues: episodeEditorDefaultValues
  });

  useEffect(() => {
    if (!episodeQuery.data) {
      return;
    }

    form.reset({
      ...toEpisodeEditorDefaults(episodeQuery.data),
      publishedAt: formatDateInputValue(episodeQuery.data.publishedAt)
    });
  }, [episodeQuery.data, form]);

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

  useEffect(() => {
    if (!imagePreviewUrl) {
      return;
    }

    return () => URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  const handleFileSelected = useCallback((file: File | null) => {
    if (!file) {
      setPendingImageFile(null);
      setImagePreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return null;
      });
      setFileSelectionError(null);
      return;
    }

    const isAccepted = (ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(
      file.type
    );

    if (!isAccepted) {
      setFileSelectionError("Only JPG, PNG, or SVG files are supported.");
      return;
    }

    setImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
    setPendingImageFile(file);
    setFileSelectionError(null);
  }, []);

  const loadError =
    episodeQuery.error && mode === "edit" ? normalizeError(episodeQuery.error) : null;

  useEffect(() => {
    if (!loadError) {
      return;
    }

    logger.warn(observabilityEvents.apiRequestFailed, {
      module: "episodes",
      action: "detail",
      status: loadError.status,
      ...(loadError.traceId ? { traceId: loadError.traceId } : {})
    });
  }, [loadError]);

  const handleNavigateBack = () => {
    if (form.formState.isDirty) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Leave this editor without saving?"
      );

      if (!shouldLeave) {
        return;
      }
    }

    setHasPendingNavigation(true);
    router.push(appRoutes.episodes);
  };

  const handleMutationSuccess = async (action: EpisodeMutationAction) => {
    setSubmitError(null);
    setActiveAction(null);
    setPendingImageFile(null);
    setImagePreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
    setFileSelectionError(null);

    if (action === "publish") {
      telemetry.onPublishSuccess({
        status: mode === "new" ? 201 : 200
      });
    } else if (action === "archive") {
      telemetry.onArchiveSuccess({
        status: mode === "new" ? 201 : 200
      });
    } else {
      telemetry.onSaveDraftSuccess({
        status: mode === "new" ? 201 : 200
      });
    }

    if (mode === "new") {
      form.reset(episodeEditorDefaultValues);
      router.replace(appRoutes.episodes);
      router.refresh();
      return;
    }

    form.reset(form.getValues());
    router.refresh();
  };

  const handleMutationError = (action: EpisodeMutationAction, error: unknown) => {
    const normalizedError = normalizeError(error);
    const reason = toTelemetryReason(normalizedError);

    setSubmitError(normalizedError);
    setActiveAction(null);

    trackApiFailure({
      module: "episodes",
      action: mode === "new" ? "create" : "update",
      endpoint: mode === "new" ? "/api/admin/episodes" : "/api/admin/episodes/{id}",
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

    if (action === "archive") {
      telemetry.onArchiveFailure({
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

  const submitAction = (action: EpisodeMutationAction) =>
    form.handleSubmit(async (values) => {
      setSubmitError(null);
      setActiveAction(action);

      let resolvedImageUrl = values.imageUrl;

      if (pendingImageFile) {
        setIsUploadingImage(true);

        try {
          const { imageUrl } = await uploadEpisodeImage(pendingImageFile);
          resolvedImageUrl = imageUrl;
        } catch (uploadError) {
          setIsUploadingImage(false);

          const normalizedError = normalizeError(uploadError);

          setSubmitError(normalizedError);
          setActiveAction(null);

          trackApiFailure({
            module: "images",
            action: "upload",
            endpoint: "/api/admin/images/upload",
            method: "POST",
            error: normalizedError,
            fallbackStatus: normalizedError.status,
            ...(normalizedError.traceId ? { traceId: normalizedError.traceId } : {})
          });

          return;
        }

        setIsUploadingImage(false);
      }

      const payload = toEpisodeRequestPayload({
        values: {
          ...values,
          imageUrl: resolvedImageUrl,
          publishedAt: toIsoDateTimeValue(values.publishedAt)
        },
        action
      });

      if (mode === "new") {
        createEpisodeMutation.mutate(payload, {
          onError: (error) => handleMutationError(action, error),
          onSuccess: async () => {
            form.setValue("imageUrl", resolvedImageUrl, { shouldDirty: false });
            await handleMutationSuccess(action);
          }
        });
        return;
      }

      if (!episodeId) {
        handleMutationError(action, {
          status: 400,
          title: "Bad Request",
          detail: "Invalid episode id."
        } satisfies AdminRouteError);
        return;
      }

      updateEpisodeMutation.mutate(
        { id: episodeId, payload },
        {
          onError: (error) => handleMutationError(action, error),
          onSuccess: async () => {
            form.setValue("imageUrl", resolvedImageUrl, { shouldDirty: false });
            await handleMutationSuccess(action);
          }
        }
      );
    });

  const status: EpisodeDisplayStatus =
    mode === "new" ? "draft" : episodeQuery.data?.status ?? "unknown";

  return {
    activeAction,
    episode: episodeQuery.data as EpisodeRecord | null | undefined,
    fileSelectionError,
    form,
    handleFileSelected,
    handleNavigateBack,
    imagePreviewUrl,
    isArchiveDisabled: mode !== "edit" || status === "archived",
    isInvalidEpisodeId: mode === "edit" && !episodeId,
    isLoading: mode === "edit" && episodeQuery.isLoading,
    isSubmitting:
      createEpisodeMutation.isPending ||
      updateEpisodeMutation.isPending ||
      isUploadingImage,
    isUploadingImage,
    loadError,
    mode,
    retryLoad: () => episodeQuery.refetch(),
    status,
    submitAction,
    submitError
  };
}
