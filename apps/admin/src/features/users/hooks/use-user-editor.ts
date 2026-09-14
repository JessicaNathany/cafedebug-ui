"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import { logger, observabilityEvents } from "@/lib/observability";

import { userEditorDefaultValues } from "../defaults";
import { parseUserRouteId } from "../parsers";
import {
  createUserEditorSchema,
  type UserEditorMode,
  type UserEditorValues
} from "../schemas/user-editor.schema";
import { toUserEditorDefaults, toUserMutationPayload } from "../transformers";
import type { UsersRouteError } from "../types/users.types";
import { useCreateUser } from "./use-create-user";
import { useUpdateUser } from "./use-update-user";
import { useUserById } from "./use-user-by-id";

type UseUserEditorOptions = { mode: UserEditorMode; id?: string | undefined };

export type { UserEditorMode };

const normalizeError = (error: unknown): UsersRouteError =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  "title" in error &&
  "detail" in error
    ? (error as UsersRouteError)
    : {
        status: 503,
        title: "Service Unavailable",
        detail: "Unable to complete this operation."
      };

export function useUserEditor({ mode, id: rawId }: UseUserEditorOptions) {
  const router = useRouter();
  const userId = mode === "edit" ? parseUserRouteId(rawId) : null;
  const schema = useMemo(() => createUserEditorSchema(mode), [mode]);
  const form = useForm<UserEditorValues>({
    resolver: zodResolver(schema),
    defaultValues: userEditorDefaultValues
  });
  const detailQuery = useUserById(userId);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const [submitError, setSubmitError] = useState<UsersRouteError | null>(null);
  const [hasPendingNavigation, setHasPendingNavigation] = useState(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  const isMountedRef = useRef(true);
  const submitInFlightRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }

    form.reset(toUserEditorDefaults(detailQuery.data));
  }, [detailQuery.data, form]);

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
    mode === "edit" && detailQuery.error ? normalizeError(detailQuery.error) : null;

  useEffect(() => {
    if (!loadError) {
      return;
    }

    logger.warn(observabilityEvents.apiRequestFailed, {
      module: "users",
      action: "detail",
      endpoint: "/api/admin/users/{id}",
      method: "GET",
      status: loadError.status,
      ...(loadError.traceId ? { traceId: loadError.traceId } : {})
    });
  }, [loadError]);

  const reportMutationError = useCallback(
    (action: "create" | "update", error: unknown) => {
      const normalized = normalizeError(error);
      if (isMountedRef.current) {
        setSubmitError(normalized);
      }

      logger.warn(observabilityEvents.apiRequestFailed, {
        module: "users",
        action,
        endpoint: action === "create" ? "/api/admin/users" : "/api/admin/users/{id}",
        method: action === "create" ? "POST" : "PUT",
        status: normalized.status,
        ...(normalized.traceId ? { traceId: normalized.traceId } : {})
      });
    },
    []
  );

  const handleNavigateBack = useCallback(() => {
    if (
      form.formState.isDirty &&
      !window.confirm("You have unsaved changes. Leave this editor without saving?")
    ) {
      return;
    }

    setHasPendingNavigation(true);
    router.push(appRoutes.users);
  }, [form.formState.isDirty, router]);

  const onSubmit = async (values: UserEditorValues) => {
    if (submitInFlightRef.current || createMutation.isPending || updateMutation.isPending) {
      return;
    }

    submitInFlightRef.current = true;
    setIsSubmitLocked(true);
    setSubmitError(null);

    try {
      const payload = toUserMutationPayload({ values, mode });

      if (mode === "new") {
        await createMutation.mutateAsync(payload);
        if (!isMountedRef.current) {
          return;
        }

        form.reset(userEditorDefaultValues);
        setHasPendingNavigation(true);
        router.replace(appRoutes.users);
        return;
      }

      if (!userId) {
        reportMutationError("update", {
          status: 400,
          title: "Bad Request",
          detail: "User id must be a positive integer."
        });
        return;
      }

      const record = await updateMutation.mutateAsync({ id: userId, payload });
      if (!isMountedRef.current) {
        return;
      }

      form.reset(toUserEditorDefaults(record));
    } catch (error) {
      reportMutationError(mode === "new" ? "create" : "update", error);
    } finally {
      submitInFlightRef.current = false;
      if (isMountedRef.current) {
        setIsSubmitLocked(false);
      }
    }
  };

  return {
    form,
    mode,
    isInvalidUserId: mode === "edit" && userId === null,
    isLoading: mode === "edit" && userId !== null && detailQuery.isLoading,
    isSubmitting: isSubmitLocked || createMutation.isPending || updateMutation.isPending,
    isNotFound: loadError?.status === 404,
    loadError,
    submitError,
    handleNavigateBack,
    onSubmit,
    retryLoad: detailQuery.refetch
  };
}
