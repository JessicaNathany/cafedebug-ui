"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { useCategories } from "@/features/categories/hooks/use-categories";

import type { EpisodeEditorSchemaValues } from "../schemas/episode.schema";
import type { AdminRouteError, EpisodeDisplayStatus, EpisodeMutationAction } from "../types/episode.types";
import { EpisodeEditorTopBar } from "./episode-editor-topbar";
import { EpisodeShowNotesField } from "./episode-show-notes-field";
import { EpisodeTitleInput } from "./episode-title-input";

type EpisodeEditorFormProps = {
  activeAction: EpisodeMutationAction | null;
  currentStatus: EpisodeDisplayStatus;
  fileSelectionError: string | null;
  form: UseFormReturn<EpisodeEditorSchemaValues>;
  imagePreviewUrl: string | null;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  isArchiveDisabled: boolean;
  mode: "new" | "edit";
  onCancel: () => void;
  onFileSelected: (file: File | null) => void;
  onSubmitAction: (action: EpisodeMutationAction) => () => void;
  submitError: AdminRouteError | null;
};

const splitTags = (value: string): string[] =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const labelClassName =
  "text-sm font-semibold tracking-tight text-on-surface";

const inputClassName =
  "w-full rounded-xl border border-outline-variant/70 bg-slate-50 px-4 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring placeholder:text-on-surface-variant/60";

const iconInputClassName =
  "w-full rounded-xl border border-outline-variant/70 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring placeholder:text-on-surface-variant/60";

const metadataSectionClassName = "space-y-5";

export function EpisodeEditorForm({
  activeAction,
  currentStatus,
  fileSelectionError,
  form,
  imagePreviewUrl,
  isSubmitting,
  isUploadingImage,
  isArchiveDisabled,
  mode,
  onCancel,
  onFileSelected,
  onSubmitAction,
  submitError
}: EpisodeEditorFormProps) {
  const [tagDraft, setTagDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError
  } = useCategories();

  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = form;

  const imageUrl = watch("imageUrl");
  const tagsValue = watch("tags");
  const tags = useMemo(() => splitTags(tagsValue), [tagsValue]);

  useEffect(() => {
    setTagDraft("");
  }, [tagsValue]);

  const commitTag = () => {
    const nextTag = tagDraft.trim().replace(/,$/, "");

    if (!nextTag) {
      return;
    }

    const nextTags = Array.from(new Set([...tags, nextTag]));

    setValue("tags", nextTags.join(", "), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    setTagDraft("");
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = tags.filter((tag) => tag !== tagToRemove);

    setValue("tags", nextTags.join(", "), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    commitTag();
  };

  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onFileSelected(nextFile);
    event.target.value = "";
  };

  const hasTrimmedImageUrl = imageUrl.trim().length > 0;
  const displayedImageSrc = imagePreviewUrl ?? (hasTrimmedImageUrl ? imageUrl : null);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <EpisodeEditorTopBar
        mode={mode}
        onBack={onCancel}
        status={currentStatus}
      />

      {submitError ? (
        <div className="border-b border-danger/30 bg-danger/10 px-6 py-3 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-danger">{submitError.title}</p>
            <p className="text-sm text-on-surface-variant">{submitError.detail}</p>
            {submitError.traceId ? (
              <p className="text-xs text-on-surface-variant">Trace ID: {submitError.traceId}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <form className="flex flex-1 flex-col" noValidate>
        <input type="hidden" {...register("imageUrl")} />

        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row">
          <section className="w-full px-6 pb-32 pt-8 md:w-[60%] md:p-8 lg:w-[68%] lg:p-12">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <EpisodeTitleInput
                  hasError={!!errors.title}
                  registration={register("title")}
                />
                {errors.title?.message ? (
                  <p className="text-xs text-danger">{errors.title.message}</p>
                ) : null}

                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>
                    Short Description
                  </span>
                  <textarea
                    aria-invalid={errors.shortDescription ? true : undefined}
                    className="min-h-24 w-full rounded-[1.75rem] border border-outline-variant/60 bg-slate-50 px-5 py-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/55 focus:border-primary focus:ring-2 focus:ring-focus-ring"
                    maxLength={500}
                    placeholder="Add a concise summary for episode cards and share surfaces."
                    {...register("shortDescription")}
                  />
                  {errors.shortDescription?.message ? (
                    <p className="text-xs text-danger">{errors.shortDescription.message}</p>
                  ) : null}
                </label>
              </div>

              <EpisodeShowNotesField
                error={errors.description?.message}
                form={form}
              />
            </div>
          </section>

          <aside className="w-full border-t border-outline-variant/60 bg-surface-container-lowest px-6 pb-10 pt-8 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.05)] md:w-[40%] md:border-l md:border-t-0 md:p-8 lg:w-[32%] lg:p-10">
            <div className="flex flex-col gap-6">
              <section className={metadataSectionClassName}>
                <div className="flex flex-col gap-3">
                  <p className={labelClassName}>Cover Artwork</p>

                  <div className="flex flex-col gap-4">
                    <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface">
                      {displayedImageSrc ? (
                        <img
                          alt="Episode cover preview"
                          className="h-full w-full object-cover"
                          src={displayedImageSrc}
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-on-surface-variant">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-4xl"
                          >
                            image
                          </span>
                          <p className="text-sm font-medium">Paste a cover image URL</p>
                          <p className="text-xs text-on-surface-variant/70">
                            Recommended 3000x3000 JPG/PNG
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 xl:max-w-[280px]">
                      <input
                        accept="image/jpeg,image/png,image/svg+xml"
                        className="hidden"
                        onChange={handleFileInputChange}
                        ref={fileInputRef}
                        type="file"
                      />
                      <button
                        className="inline-flex h-12 items-center justify-center rounded-full border border-outline-variant/70 px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isUploadingImage}
                        onClick={handleChooseImageClick}
                        type="button"
                      >
                        {isUploadingImage ? "Uploading image..." : "Choose Image"}
                      </button>
                      {fileSelectionError ? (
                        <p className="text-xs text-danger">{fileSelectionError}</p>
                      ) : (
                        <p className="text-sm leading-6 text-on-surface-variant">
                          Recommended: 3000x3000px. Format: JPG, PNG, or SVG.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {errors.imageUrl?.message ? (
                  <p className="text-xs text-danger">{errors.imageUrl.message}</p>
                ) : null}
              </section>

              <section className={metadataSectionClassName}>
                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>Audio URL</span>
                  <span className="relative block">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                    >
                      link
                    </span>
                    <input
                      aria-invalid={errors.url ? true : undefined}
                      className={iconInputClassName}
                      placeholder="https://omny.fm/shows/..."
                      type="url"
                      {...register("url")}
                    />
                  </span>
                  {errors.url?.message ? (
                    <p className="text-xs text-danger">{errors.url.message}</p>
                  ) : null}
                </label>

                <label className="flex max-w-[160px] flex-col gap-2">
                  <span className={labelClassName}># Number</span>
                  <input
                    aria-invalid={errors.number ? true : undefined}
                    className={inputClassName}
                    inputMode="numeric"
                    placeholder="13"
                    type="number"
                    {...register("number")}
                  />
                  {errors.number?.message ? (
                    <p className="text-xs text-danger">{errors.number.message}</p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>Category</span>
                  <span className="relative block">
                    <Controller
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <select
                          aria-invalid={errors.categoryId ? true : undefined}
                          className={`${inputClassName} cursor-pointer appearance-none pr-12`}
                          disabled={isCategoriesLoading || isCategoriesError}
                          {...field}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={String(category.id)}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
                    >
                      expand_more
                    </span>
                  </span>
                  {errors.categoryId?.message ? (
                    <p className="text-xs text-danger">{errors.categoryId.message}</p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>Publish Date</span>
                  <span className="relative block">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                    >
                      calendar_today
                    </span>
                    <input
                      aria-invalid={errors.publishedAt ? true : undefined}
                      className={iconInputClassName}
                      step={1}
                      type="datetime-local"
                      {...register("publishedAt")}
                    />
                  </span>
                  {errors.publishedAt?.message ? (
                    <p className="text-xs text-danger">{errors.publishedAt.message}</p>
                  ) : null}
                </label>

                <div className="flex flex-col gap-3">
                  <span className={labelClassName}>Tags</span>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          className="inline-flex items-center gap-1 rounded-md border border-status-draft-border bg-status-draft-surface px-2 py-1 text-xs font-medium text-status-draft-on"
                          key={tag}
                        >
                          {tag}
                          <button
                            aria-label={`Remove ${tag}`}
                            className="inline-flex items-center justify-center text-status-draft-on transition-colors hover:opacity-70"
                            onClick={(event) => {
                              event.preventDefault();
                              removeTag(tag);
                            }}
                            type="button"
                          >
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined text-xs leading-none"
                            >
                              close
                            </span>
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <input
                    className={inputClassName}
                    onBlur={commitTag}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag and press enter..."
                    type="text"
                    value={tagDraft}
                  />
                  {errors.tags?.message ? (
                    <p className="text-xs text-danger">{errors.tags.message}</p>
                  ) : (
                    <p className="text-xs text-on-surface-variant">
                      Press enter to add keywords.
                    </p>
                  )}
                </div>
              </section>

            </div>
          </aside>
        </div>

        <footer className="mt-auto border-t border-outline-variant/60 bg-surface-container-lowest p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-2 md:px-4">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
              onClick={(event) => {
                event.preventDefault();
                onCancel();
              }}
              type="button"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface shadow-sm transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={(event) => {
                  event.preventDefault();
                  onSubmitAction("save-draft")();
                }}
                type="button"
              >
                {isSubmitting && activeAction === "save-draft"
                  ? "Saving Draft..."
                  : "Save Draft"}
              </button>

              {mode === "edit" ? (
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-status-archived-border bg-status-archived-surface px-5 py-2.5 text-sm font-semibold text-status-archived-on shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting || isArchiveDisabled}
                  onClick={(event) => {
                    event.preventDefault();
                    onSubmitAction("archive")();
                  }}
                  type="button"
                >
                  {isSubmitting && activeAction === "archive" ? "Archiving..." : "Archive"}
                </button>
              ) : null}

              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={(event) => {
                  event.preventDefault();
                  onSubmitAction("publish")();
                }}
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  send
                </span>
                {isSubmitting && activeAction === "publish" ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
