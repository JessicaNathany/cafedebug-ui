type UsersEditorErrorStateProps = {
  title: string;
  detail: string;
  traceId?: string;
  onBack: () => void;
  onRetry?: () => void;
};

export function UsersEditorErrorState({
  title,
  detail,
  traceId,
  onBack,
  onRetry
}: UsersEditorErrorStateProps) {
  return (
    <section className="mx-auto mt-12 w-full max-w-2xl rounded-xl border border-danger/40 bg-surface-container-low p-6">
      <h2 className="text-lg font-semibold text-danger">{title}</h2>
      <p className="mt-2 text-sm text-on-surface-variant">{detail}</p>
      {traceId ? (
        <p className="mt-2 text-xs text-on-surface-variant">
          Trace ID: <code>{traceId}</code>
        </p>
      ) : null}

      <div className="mt-5 flex items-center gap-3">
        <button
          className="inline-flex h-10 items-center rounded-lg bg-surface-container-high px-4 text-sm font-semibold text-on-surface"
          onClick={onBack}
          type="button"
        >
          Back to users
        </button>
        {onRetry ? (
          <button
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary"
            onClick={onRetry}
            type="button"
          >
            Retry
          </button>
        ) : null}
      </div>
    </section>
  );
}
