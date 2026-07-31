"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { TeamMemberEditorValues } from "../schemas/team-member.schema";

type TeamMemberProfilePhotoFieldProps = {
  form: UseFormReturn<TeamMemberEditorValues>;
  name: string;
  imagePreviewUrl: string | null;
  isUploadingImage: boolean;
  fileSelectionError: string | null;
  onFileSelected: (file: File | null) => void | Promise<void>;
};

const inputClassName =
  "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 hover:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-focus-ring";

const buildPreviewCandidates = (source: string): string[] => {
  const candidates = new Set<string>([source]);
  const duplicatedUploadsSegment = "/cafedebug-uploads/cafedebug-uploads/";
  const singleUploadsSegment = "/cafedebug-uploads/";

  const add = (value: string) => {
    if (value.trim().length > 0) {
      candidates.add(value);
    }
  };

  if (source.includes(duplicatedUploadsSegment)) {
    add(source.replace(duplicatedUploadsSegment, singleUploadsSegment));
  }

  if (source.includes(singleUploadsSegment)) {
    add(source.replace(singleUploadsSegment, duplicatedUploadsSegment));
  }

  if (source.includes("/team-members/")) {
    add(source.replace("/team-members/", "/teamMembers/"));
    add(source.replace("/team-members/", "/contributors/"));
  }

  if (source.includes("/teamMembers/")) {
    add(source.replace("/teamMembers/", "/team-members/"));
    add(source.replace("/teamMembers/", "/contributors/"));
  }

  if (source.includes("/contributors/")) {
    add(source.replace("/contributors/", "/team-members/"));
    add(source.replace("/contributors/", "/teamMembers/"));
  }

  try {
    const parsedUrl = new URL(source);
    const pathSegments = parsedUrl.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1] ?? "";
    const hasExtension = /\.[A-Za-z0-9]+$/.test(lastSegment);

    if (!hasExtension && lastSegment.length > 0) {
      const base = `${parsedUrl.origin}${parsedUrl.pathname}`;
      const suffix = `${parsedUrl.search}${parsedUrl.hash}`;
      add(`${base}.jpg${suffix}`);
      add(`${base}.jpeg${suffix}`);
      add(`${base}.png${suffix}`);
      add(`${base}.webp${suffix}`);
    }
  } catch {
    // Keep fallback candidates best-effort when URL parsing fails.
  }

  return Array.from(candidates);
};

export function TeamMemberProfilePhotoField({
  form,
  name,
  imagePreviewUrl,
  isUploadingImage,
  fileSelectionError,
  onFileSelected,
}: TeamMemberProfilePhotoFieldProps) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewSrcIndex, setPreviewSrcIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    formState: { errors },
  } = form;
  const url = form.watch("profilePhotoUrl").trim();
  const displayedImageSrc = imagePreviewUrl ?? (url.length > 0 ? url : null);
  const previewCandidates = useMemo(() => {
    if (!displayedImageSrc) {
      return [] as string[];
    }

    return buildPreviewCandidates(displayedImageSrc);
  }, [displayedImageSrc]);
  const previewSrc = previewCandidates[previewSrcIndex] ?? null;
  const error = errors.profilePhotoUrl?.message;

  const profilePhotoUrlField = register("profilePhotoUrl", {
    onChange: () => setPreviewFailed(false),
  });

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setPreviewFailed(false);
    setPreviewSrcIndex(0);
  }, [displayedImageSrc]);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold tracking-tight text-on-surface">Profile photo</p>
        <p className="mt-1 text-xs leading-5 text-on-surface-variant">
          Upload an image from your computer or paste a public image URL.
        </p>
      </div>

      <div className="rounded-2xl bg-surface-container-low p-4 shadow-ambient">
        <div className="mx-auto flex aspect-square w-60 max-w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-container text-center">
          {previewSrc && !previewFailed ? (
            <img
              alt={`Profile photo preview for ${name.trim() || "team member"}`}
              className="h-full w-full object-cover"
              onError={() => {
                if (previewSrcIndex < previewCandidates.length - 1) {
                  setPreviewSrcIndex((current) => current + 1);
                  return;
                }

                setPreviewFailed(true);
              }}
              src={previewSrc}
            />
          ) : (
            <div className="px-6 text-on-surface-variant">
              <span aria-hidden="true" className="material-symbols-outlined text-4xl">
                account_circle
              </span>
              <p className="mt-2 text-sm font-medium text-on-surface">
                {displayedImageSrc ? "Preview unavailable" : "No profile photo"}
              </p>
              <p className="mt-1 text-xs">
                {displayedImageSrc
                  ? "The URL can still be saved if it is valid."
                  : "Add an image URL or upload a file to show a preview."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <input
            accept="image/jpeg,image/png,image/svg+xml"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              void onFileSelected(file);
              event.target.value = "";
            }}
            ref={fileInputRef}
            type="file"
          />
          <button
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-outline-variant/60 bg-surface px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isUploadingImage}
            onClick={openFilePicker}
            type="button"
          >
            {isUploadingImage
              ? "Uploading image..."
              : displayedImageSrc
                ? "Replace image"
                : "Add image"}
          </button>
        </div>

        <label className="mt-4 flex flex-col gap-2" htmlFor="team-member-profile-photo-url">
          <span className="text-sm font-semibold tracking-tight text-on-surface">
            Profile photo URL
          </span>
          <input
            aria-describedby={error ? "team-member-profile-photo-url-error" : undefined}
            aria-invalid={error ? true : undefined}
            className={inputClassName}
            id="team-member-profile-photo-url"
            placeholder="https://example.com/profile.jpg"
            type="url"
            {...profilePhotoUrlField}
          />
        </label>

        {fileSelectionError ? (
          <p className="mt-2 text-xs text-danger">{fileSelectionError}</p>
        ) : null}

        {error ? (
          <p className="mt-2 text-xs text-danger" id="team-member-profile-photo-url-error">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
