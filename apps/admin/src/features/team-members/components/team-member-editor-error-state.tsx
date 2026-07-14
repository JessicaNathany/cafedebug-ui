"use client";

type TeamMemberEditorErrorStateProps = { title: string; detail: string; traceId?: string | undefined; onBack: () => void; onRetry?: () => void; };

export function TeamMemberEditorErrorState({ title, detail, traceId, onBack, onRetry }: TeamMemberEditorErrorStateProps) {
  return <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10 lg:px-8 xl:px-10 xl:py-12">
    <div className="rounded-2xl bg-surface-container-low px-6 py-8 shadow-ambient lg:px-8" role="alert">
      <h1 className="font-display text-3xl font-bold text-on-surface">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-on-surface-variant">{detail}</p>
      {traceId ? <p className="mt-3 text-xs text-on-surface-variant">Trace ID: {traceId}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {onRetry ? <button className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring" onClick={onRetry} type="button">Retry</button> : null}
        <button className="inline-flex h-12 items-center rounded-full bg-surface-container-high px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring" onClick={onBack} type="button">Back to team members</button>
      </div>
    </div>
  </section>;
}
