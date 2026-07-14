"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import { logger, observabilityEvents } from "@/lib/observability";

import { teamMemberEditorDefaultValues } from "../defaults";
import { parseTeamMemberRouteId } from "../parsers";
import { teamMemberEditorSchema, type TeamMemberEditorValues } from "../schemas/team-member.schema";
import { toTeamMemberEditorDefaults, toTeamMemberRequestPayload } from "../transformers";
import type { TeamMembersRouteError } from "../types/team-member.types";
import { useCreateTeamMember } from "./use-create-team-member";
import { useTeamMemberById } from "./use-team-member-by-id";
import { useUpdateTeamMember } from "./use-update-team-member";

export type TeamMemberEditorMode = "new" | "edit";
type UseTeamMemberEditorOptions = { mode: TeamMemberEditorMode; id?: string | undefined };

const normalizeError = (error: unknown): TeamMembersRouteError =>
  typeof error === "object" && error !== null && "status" in error && "title" in error && "detail" in error
    ? error as TeamMembersRouteError
    : { status: 503, title: "Service Unavailable", detail: "Unable to complete this operation." };

export function useTeamMemberEditor({ mode, id: rawId }: UseTeamMemberEditorOptions) {
  const router = useRouter();
  const teamMemberId = mode === "edit" ? parseTeamMemberRouteId(rawId) : null;
  const form = useForm<TeamMemberEditorValues>({ resolver: zodResolver(teamMemberEditorSchema), defaultValues: teamMemberEditorDefaultValues });
  const detailQuery = useTeamMemberById(teamMemberId);
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const [submitError, setSubmitError] = useState<TeamMembersRouteError | null>(null);
  const [hasPendingNavigation, setHasPendingNavigation] = useState(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);
  const isMountedRef = useRef(true);
  const submitInFlightRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!detailQuery.data) return;
    form.reset(toTeamMemberEditorDefaults(detailQuery.data));
    void form.trigger(["name", "podcastRole"]);
  }, [detailQuery.data, form]);

  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || hasPendingNavigation) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => window.removeEventListener("beforeunload", beforeUnloadHandler);
  }, [form.formState.isDirty, hasPendingNavigation]);

  const loadError = mode === "edit" && detailQuery.error ? normalizeError(detailQuery.error) : null;
  useEffect(() => {
    if (!loadError) return;
    logger.warn(observabilityEvents.apiRequestFailed, { module: "team-members", action: "detail", endpoint: "/api/admin/team-members/{id}", method: "GET", status: loadError.status, ...(loadError.traceId ? { traceId: loadError.traceId } : {}) });
  }, [loadError]);

  const reportMutationError = useCallback((action: "create" | "update", error: unknown) => {
    const normalized = normalizeError(error);
    if (isMountedRef.current) setSubmitError(normalized);
    logger.warn(observabilityEvents.apiRequestFailed, { module: "team-members", action, endpoint: action === "create" ? "/api/admin/team-members" : "/api/admin/team-members/{id}", method: action === "create" ? "POST" : "PUT", status: normalized.status, ...(normalized.traceId ? { traceId: normalized.traceId } : {}) });
  }, []);

  const handleNavigateBack = useCallback(() => {
    if (form.formState.isDirty && !window.confirm("You have unsaved changes. Leave this editor without saving?")) return;
    setHasPendingNavigation(true);
    router.push(appRoutes.teamMembers);
  }, [form.formState.isDirty, router]);

  const onSubmit = async (values: TeamMemberEditorValues) => {
    if (submitInFlightRef.current || createMutation.isPending || updateMutation.isPending) return;
    submitInFlightRef.current = true;
    setIsSubmitLocked(true);
    setSubmitError(null);
    try {
      const payload = toTeamMemberRequestPayload(values);
      if (mode === "new") {
        await createMutation.mutateAsync(payload);
        if (!isMountedRef.current) return;
        form.reset(teamMemberEditorDefaultValues);
        setHasPendingNavigation(true);
        router.replace(appRoutes.teamMembers);
        return;
      }
      if (!teamMemberId) {
        reportMutationError("update", { status: 400, title: "Bad Request", detail: "Team member id must be a positive integer." });
        return;
      }
      const record = await updateMutation.mutateAsync({ id: teamMemberId, payload });
      if (!isMountedRef.current) return;
      form.reset(toTeamMemberEditorDefaults(record));
    } catch (error) {
      reportMutationError(mode === "new" ? "create" : "update", error);
    } finally {
      submitInFlightRef.current = false;
      if (isMountedRef.current) setIsSubmitLocked(false);
    }
  };

  return {
    form, mode, teamMember: detailQuery.data, isInvalidTeamMemberId: mode === "edit" && teamMemberId === null,
    isLoading: mode === "edit" && teamMemberId !== null && detailQuery.isLoading,
    isSubmitting: isSubmitLocked || createMutation.isPending || updateMutation.isPending,
    isNotFound: loadError?.status === 404, loadError, submitError,
    active: form.watch("isActive"), handleNavigateBack, onSubmit, retryLoad: detailQuery.refetch
  };
}
