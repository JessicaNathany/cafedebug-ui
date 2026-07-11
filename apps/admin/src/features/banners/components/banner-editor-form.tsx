"use client";

import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { BannerEditorSchemaValues } from "../schemas/banner.schema";
import type {
  BannerEditorMode,
  BannerMutationAction,
  BannerRouteError
} from "../types/banner.types";
import { BannerEditorTopBar } from "./banner-editor-topbar";

type BannerEditorFormProps = {
  activeAction: BannerMutationAction | null;
  activeStatus: boolean;
  form: UseFormReturn<BannerEditorSchemaValues>;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  mode: BannerEditorMode;
  onCancel: () => void;
  onSelectImage: (file: File | null) => void | Promise<void>;
  onSubmitAction: (action: BannerMutationAction) => () => void;
  submitError: BannerRouteError | null;
};

const labelClassName = "text-sm font-semibold tracking-tight text-on-surface";
const iconInputClassName =
  "w-full rounded-xl border border-outline-variant/60 bg-surface pl-10 pr-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-focus-ring";
const metadataSectionClassName = "space-y-4";

export function BannerEditorForm({
  activeAction,
  activeStatus,
  form,
  isSubmitting,
  isUploadingImage,
  mode,
  onCancel,
  onSelectImage,
  onSubmitAction,
  submitError
}: BannerEditorFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    watch,
    formState: { errors }
  } = form;

  const imageUrl = watch("urlImage");
  const urlImageField = register("urlImage");
  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BannerEditorTopBar active={mode === "edit" ? activeStatus : false} mode={mode} onBack={onCancel} />

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
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col xl:flex-row">
          <section className="w-full px-6 pb-32 pt-8 xl:w-[68%] xl:px-10 xl:pt-12">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <textarea
                  aria-describedby={errors.name ? "banner-name-error" : "banner-name-help"}
                  aria-invalid={errors.name ? true : undefined}
                  className="min-h-[4rem] w-full resize-none border-0 border-b-2 border-transparent bg-transparent px-0 py-1.5 font-display text-3xl font-bold leading-tight text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/35 hover:border-outline-variant/60 focus:border-primary focus:ring-0 md:min-h-[4.5rem] md:text-4xl xl:text-5xl"
                  placeholder="Banner title"
                  rows={2}
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-xs text-danger" id="banner-name-error">{errors.name.message}</p>
                ) : null}
              </div>
            </div>
          </section>

          <aside className="w-full border-t border-outline-variant/60 bg-surface-container-lowest px-6 pb-10 pt-8 xl:w-[32%] xl:border-l xl:border-t-0 xl:px-10 xl:pt-10">
            <div className="flex flex-col gap-8">
              <section className={metadataSectionClassName}>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className={labelClassName}>Cover Artwork</p>
                    <p className="mt-1 text-xs leading-5 text-on-surface-variant" id="banner-url-image-help">
                      Upload the banner artwork to store it before saving or publishing this campaign.
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] bg-surface-container-low p-4 shadow-ambient">
                    <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-[1.5rem] border-2 border-dashed border-outline-variant/60 bg-surface">
                      {imageUrl.trim().length > 0 ? (
                        <img alt="Banner artwork preview" className="h-full w-full object-cover" src={imageUrl} />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-on-surface-variant">
                          <span aria-hidden="true" className="material-symbols-outlined text-4xl">
                            image
                          </span>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-on-surface">No artwork selected</p>
                            <p className="text-xs text-on-surface-variant">
                              Choose an image file to upload the banner artwork.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      <input
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          void onSelectImage(file);
                          event.target.value = "";
                        }}
                        ref={fileInputRef}
                        type="file"
                      />
                      <input type="hidden" {...urlImageField} />
                      <button
                        aria-describedby={errors.urlImage ? "banner-url-image-error" : "banner-url-image-help"}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-outline-variant/60 bg-surface px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isUploadingImage}
                        onClick={openFilePicker}
                        type="button"
                      >
                        {isUploadingImage
                          ? "Uploading image..."
                          : imageUrl.trim().length > 0
                            ? "Replace image"
                            : "Add image"}
                      </button>
                    </div>
                  </div>
                </div>

                {errors.urlImage?.message ? (
                  <p className="text-xs text-danger" id="banner-url-image-error">{errors.urlImage.message}</p>
                ) : null}
              </section>

              <section className={metadataSectionClassName}>
                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>URL</span>
                  <span className="relative block">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                    >
                      link
                    </span>
                    <input
                      aria-describedby={errors.url ? "banner-url-error" : undefined}
                      aria-invalid={errors.url ? true : undefined}
                      className={iconInputClassName}
                      placeholder="https://example.com/banner-link"
                      type="url"
                      {...register("url")}
                    />
                  </span>
                  {errors.url?.message ? (
                    <p className="text-xs text-danger" id="banner-url-error">{errors.url.message}</p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>Start Date</span>
                  <span className="relative block">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                    >
                      calendar_today
                    </span>
                    <input
                      aria-describedby={errors.startDate ? "banner-start-date-error" : undefined}
                      aria-invalid={errors.startDate ? true : undefined}
                      className={iconInputClassName}
                      type="datetime-local"
                      {...register("startDate")}
                    />
                  </span>
                  {errors.startDate?.message ? (
                    <p className="text-xs text-danger" id="banner-start-date-error">{errors.startDate.message}</p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClassName}>End Date</span>
                  <span className="relative block">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                    >
                      calendar_today
                    </span>
                    <input
                      aria-describedby={errors.endDate ? "banner-end-date-error" : "banner-end-date-help"}
                      aria-invalid={errors.endDate ? true : undefined}
                      className={iconInputClassName}
                      type="datetime-local"
                      {...register("endDate")}
                    />
                  </span>
                  {errors.endDate?.message ? (
                    <p className="text-xs text-danger" id="banner-end-date-error">{errors.endDate.message}</p>
                  ) : (
                    <p className="text-xs text-on-surface-variant" id="banner-end-date-help">
                      Leave empty to keep the banner active with no end date.
                    </p>
                  )}
                </label>
              </section>
            </div>
          </aside>
        </div>

        <footer className="sticky bottom-0 z-20 mt-auto border-t border-outline-variant/60 bg-surface-container-lowest p-4 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-2 md:px-4">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/70 bg-surface px-5 py-2.5 text-sm font-semibold text-on-surface shadow-sm transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                onClick={(event) => {
                  event.preventDefault();
                  onSubmitAction("save-draft")();
                }}
                type="button"
              >
                {isSubmitting && activeAction === "save-draft" ? "Saving Draft..." : "Save Draft"}
              </button>

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
