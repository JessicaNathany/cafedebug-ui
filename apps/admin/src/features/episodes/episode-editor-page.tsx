"use client";

import Link from "next/link";

import { appRoutes } from "@/lib/routes";

import { EpisodeEditorForm } from "./components/episode-editor-form";
import { EpisodeEditorTopBar } from "./components/episode-editor-topbar";
import { useEpisodeEditor, type EpisodeEditorMode } from "./hooks/use-episode-editor";

type EpisodeEditorPageProps = {
  mode: EpisodeEditorMode;
  id?: string;
};

const statePanelClassName =
  "mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-6 px-6 py-10 lg:px-8 xl:px-10 xl:py-12";

export function EpisodeEditorPage({ mode, id }: EpisodeEditorPageProps) {
  const editor = useEpisodeEditor({ id, mode });

  if (editor.isInvalidEpisodeId) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <EpisodeEditorTopBar
          mode={mode}
          onBack={editor.handleNavigateBack}
          status={mode === "new" ? "draft" : "unknown"}
        />
        <section className={statePanelClassName}>
          <div className="rounded-[2rem] bg-surface-container-low px-6 py-8 shadow-ambient lg:px-8">
            <h1 className="font-display text-3xl font-bold text-on-surface">
              Invalid episode id
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-on-surface-variant">
              The requested episode id is invalid. Return to the episodes list and choose a
              valid record.
            </p>
            <Link
              className="mt-6 inline-flex h-12 items-center rounded-full bg-surface-container-high px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
              href={appRoutes.episodes}
            >
              Back to episodes
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (editor.isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <EpisodeEditorTopBar
          mode={mode}
          onBack={editor.handleNavigateBack}
          status={mode === "new" ? "draft" : "unknown"}
        />
        <section className="grid flex-1 animate-pulse xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          <div className="space-y-8 px-6 pb-32 pt-8 lg:px-8 xl:px-10 xl:pt-12">
            <span className="block h-16 w-full max-w-[760px] rounded-2xl bg-surface-container-low" />
            <span className="block h-24 w-full max-w-[820px] rounded-[1.75rem] bg-surface-container-low" />
            <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-ambient">
              <span className="mb-4 block h-12 w-full rounded-2xl bg-surface-container-low" />
              <span className="block min-h-[520px] w-full rounded-[1.75rem] bg-surface-container-low" />
            </div>
          </div>
          <div className="border-t border-outline-variant/60 px-6 pb-32 pt-8 lg:px-8 xl:border-l xl:border-t-0 xl:px-10">
            <div className="space-y-6">
              <span className="block aspect-square w-full max-w-[280px] rounded-[2rem] bg-surface-container-low" />
              <span className="block h-12 w-full rounded-full bg-surface-container-low" />
              <span className="block h-12 w-full rounded-full bg-surface-container-low" />
              <span className="block h-12 w-full rounded-full bg-surface-container-low" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (editor.loadError) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <EpisodeEditorTopBar
          mode={mode}
          onBack={editor.handleNavigateBack}
          status={mode === "new" ? "draft" : "unknown"}
        />
        <section className={statePanelClassName}>
          <div className="rounded-[2rem] border border-danger/20 bg-danger/10 px-6 py-8 lg:px-8">
            <h1 className="font-display text-3xl font-bold text-on-surface">
              {editor.loadError.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-on-surface-variant">
              {editor.loadError.detail}
            </p>
            {editor.loadError.traceId ? (
              <p className="mt-3 text-xs text-on-surface-variant">
                Trace ID: {editor.loadError.traceId}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-strong"
                onClick={() => void editor.retryLoad()}
                type="button"
              >
                Retry
              </button>
              <button
                className="inline-flex h-12 items-center rounded-full bg-surface-container-high px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                onClick={editor.handleNavigateBack}
                type="button"
              >
                Back to episodes
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <EpisodeEditorForm
      activeAction={editor.activeAction}
      currentStatus={editor.status}
      fileSelectionError={editor.fileSelectionError}
      form={editor.form}
      imagePreviewUrl={editor.imagePreviewUrl}
      isSubmitting={editor.isSubmitting}
      isUploadingImage={editor.isUploadingImage}
      isArchiveDisabled={editor.isArchiveDisabled}
      mode={mode}
      onCancel={editor.handleNavigateBack}
      onFileSelected={editor.handleFileSelected}
      onSubmitAction={editor.submitAction}
      submitError={editor.submitError}
    />
  );
}
