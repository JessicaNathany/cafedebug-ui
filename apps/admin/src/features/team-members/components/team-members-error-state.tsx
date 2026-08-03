import type { TeamMembersRouteError } from "../types/team-member.types";

type TeamMembersErrorStateProps = {
  error: TeamMembersRouteError;
  onRetry: () => void;
};

export function TeamMembersErrorState({
  error,
  onRetry
}: TeamMembersErrorStateProps) {
  return (
    <div className="space-y-3 rounded-lg border border-danger bg-surface-container p-4" role="alert">
      <p className="text-sm font-semibold text-danger">{error.title}</p>
      <p className="text-sm text-on-surface-variant">{error.detail}</p>

      {error.traceId ? (
        <p className="text-xs text-on-surface-variant">
          Trace ID: <code>{error.traceId}</code>
        </p>
      ) : null}

      <button
        className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary"
        onClick={onRetry}
        type="button"
      >
        Retry fetch
      </button>
    </div>
  );
}