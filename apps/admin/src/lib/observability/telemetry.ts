import {
  isNormalizedApiError,
  normalizeApiError,
  type NormalizedApiError
} from "@cafedebug/api-client";
import * as Sentry from "@sentry/nextjs";

import { sanitizeTelemetryRecord } from "./redaction";

export type TelemetryLevel = "debug" | "info" | "warn" | "error";
type TelemetryOutcome = "success" | "failure";
type LoginEventSource = "login-form" | "auth-login-route";
type EpisodeEditorMode = "create" | "edit";
type EpisodeMutationAction = "save-draft" | "archive" | "publish";

type TelemetryEventInput = {
  level: TelemetryLevel;
  event: string;
  module: string;
  action: string;
  outcome?: TelemetryOutcome;
  traceId?: string;
  status?: number;
  details?: Record<string, unknown>;
  error?: unknown;
};

type LoginFailureInput = {
  source: LoginEventSource;
  status?: number;
  traceId?: string;
  reason: string;
};

type ApiFailureInput = {
  module: string;
  action: string;
  endpoint: string;
  method: string;
  error: unknown;
  fallbackStatus?: number;
  traceId?: string;
};

type EpisodeOutcomeInput = {
  mode: EpisodeEditorMode;
  action: EpisodeMutationAction;
  outcome: TelemetryOutcome;
  traceId?: string;
  status?: number;
  reason?: string;
};

type EpisodeOutcomeContext = {
  status?: number;
  traceId?: string;
  reason?: string;
};

type CaptureUiExceptionInput = {
  module: string;
  action: string;
  error: unknown;
  traceId?: string;
  details?: Record<string, unknown>;
};

export type EpisodeEditorTelemetryHooks = {
  onSaveDraftSuccess: (context?: EpisodeOutcomeContext) => void;
  onSaveDraftFailure: (context?: EpisodeOutcomeContext) => void;
  onArchiveSuccess: (context?: EpisodeOutcomeContext) => void;
  onArchiveFailure: (context?: EpisodeOutcomeContext) => void;
  onPublishSuccess: (context?: EpisodeOutcomeContext) => void;
  onPublishFailure: (context?: EpisodeOutcomeContext) => void;
};

const sentryLevelByTelemetryLevel = {
  debug: "debug",
  info: "info",
  warn: "warning",
  error: "error"
} as const;

const isErrorLike = (value: unknown): value is Error => value instanceof Error;

const toError = (value: unknown, fallbackMessage: string): Error => {
  if (isErrorLike(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return new Error(value);
  }

  return new Error(fallbackMessage);
};

const writeStructuredLog = (
  level: TelemetryLevel,
  record: Record<string, unknown>
): void => {
  const serializedRecord = JSON.stringify(record);

  if (level === "error") {
    console.error(serializedRecord);
    return;
  }

  if (level === "warn") {
    console.warn(serializedRecord);
    return;
  }

  if (
    typeof window === "undefined" &&
    typeof process !== "undefined" &&
    typeof process.stdout?.write === "function"
  ) {
    process.stdout.write(`${serializedRecord}\n`);
    return;
  }

  console.warn(serializedRecord);
};

const emitTelemetryEvent = ({
  level,
  event,
  module,
  action,
  outcome,
  traceId,
  status,
  details,
  error
}: TelemetryEventInput): void => {
  const payload = sanitizeTelemetryRecord({
    timestamp: new Date().toISOString(),
    level,
    event,
    module,
    action,
    ...(typeof outcome !== "undefined" ? { outcome } : {}),
    ...(typeof status === "number" ? { status } : {}),
    ...(traceId ? { traceId } : {}),
    ...(details ? { details } : {})
  }) as Record<string, unknown>;

  writeStructuredLog(level, payload);

  Sentry.addBreadcrumb({
    category: `admin.${module}`,
    message: event,
    level: sentryLevelByTelemetryLevel[level],
    data: {
      action,
      ...(typeof outcome !== "undefined" ? { outcome } : {}),
      ...(typeof status === "number" ? { status } : {}),
      ...(traceId ? { traceId } : {}),
      ...(details ? { details: sanitizeTelemetryRecord(details) } : {})
    }
  });

  if (level !== "error") {
    return;
  }

  const fallbackMessage =
    typeof payload.event === "string" ? payload.event : "admin.telemetry.error";
  const errorToReport = toError(error, fallbackMessage);

  Sentry.withScope((scope) => {
    scope.setLevel("error");
    scope.setTag("module", module);
    scope.setTag("action", action);

    if (traceId) {
      scope.setTag("trace_id", traceId);
    }

    if (typeof status === "number") {
      scope.setTag("http_status", String(status));
    }

    if (details) {
      scope.setContext(
        "telemetry",
        sanitizeTelemetryRecord(details) as Record<string, unknown>
      );
    }

    Sentry.captureException(errorToReport);
  });
};

export const trackLoginSuccess = (source: LoginEventSource): void => {
  emitTelemetryEvent({
    level: "info",
    event: "auth.login.success",
    module: "auth",
    action: "login",
    outcome: "success",
    details: { source }
  });
};

export const trackLoginFailure = ({
  source,
  status,
  traceId,
  reason
}: LoginFailureInput): void => {
  emitTelemetryEvent({
    level: typeof status === "number" && status >= 500 ? "error" : "warn",
    event: "auth.login.failure",
    module: "auth",
    action: "login",
    outcome: "failure",
    ...(typeof status === "number" ? { status } : {}),
    ...(traceId ? { traceId } : {}),
    details: {
      source,
      reason
    }
  });
};

export const trackApiFailure = ({
  module,
  action,
  endpoint,
  method,
  error,
  fallbackStatus = 500,
  traceId
}: ApiFailureInput): NormalizedApiError => {
  const normalizedError = isNormalizedApiError(error)
    ? error
    : normalizeApiError(error, fallbackStatus);
  const resolvedTraceId = traceId ?? normalizedError.traceId;

  emitTelemetryEvent({
    level: normalizedError.status >= 500 ? "error" : "warn",
    event: "api.failure",
    module,
    action,
    outcome: "failure",
    status: normalizedError.status,
    ...(resolvedTraceId ? { traceId: resolvedTraceId } : {}),
    details: {
      endpoint,
      method,
      title: normalizedError.title,
      detail: normalizedError.detail
    },
    error
  });

  return normalizedError;
};

export const trackEpisodeEditorOutcome = ({
  mode,
  action,
  outcome,
  traceId,
  status,
  reason
}: EpisodeOutcomeInput): void => {
  emitTelemetryEvent({
    level: outcome === "failure" ? "error" : "info",
    event: "episodes.mutation.outcome",
    module: "episodes",
    action: `${mode}.${action}`,
    outcome,
    ...(traceId ? { traceId } : {}),
    ...(typeof status === "number" ? { status } : {}),
    details: {
      mode,
      mutation: action,
      ...(reason ? { reason } : {})
    }
  });
};

export const createEpisodeEditorTelemetryHooks = (
  mode: EpisodeEditorMode
): EpisodeEditorTelemetryHooks => ({
  onSaveDraftSuccess: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "save-draft",
      outcome: "success",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    }),
  onSaveDraftFailure: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "save-draft",
      outcome: "failure",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    }),
  onArchiveSuccess: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "archive",
      outcome: "success",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    }),
  onArchiveFailure: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "archive",
      outcome: "failure",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    }),
  onPublishSuccess: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "publish",
      outcome: "success",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    }),
  onPublishFailure: (context) =>
    trackEpisodeEditorOutcome({
      mode,
      action: "publish",
      outcome: "failure",
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(typeof context?.status === "number" ? { status: context.status } : {}),
      ...(context?.reason ? { reason: context.reason } : {})
    })
});

export const captureUiException = ({
  module,
  action,
  error,
  traceId,
  details
}: CaptureUiExceptionInput): void => {
  emitTelemetryEvent({
    level: "error",
    event: "ui.exception",
    module,
    action,
    outcome: "failure",
    ...(traceId ? { traceId } : {}),
    ...(details ? { details } : {}),
    error
  });
};
