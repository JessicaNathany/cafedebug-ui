"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { TeamMemberEditorValues } from "../schemas/team-member.schema";

type TeamMemberProfilePhotoFieldProps = { form: UseFormReturn<TeamMemberEditorValues>; name: string };
const inputClassName = "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 hover:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-focus-ring";

export function TeamMemberProfilePhotoField({ form, name }: TeamMemberProfilePhotoFieldProps) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const { register, formState: { errors } } = form;
  const url = form.watch("profilePhotoUrl").trim();
  const error = errors.profilePhotoUrl?.message;
  return <section className="space-y-4">
    <div><p className="text-sm font-semibold tracking-tight text-on-surface">Profile photo</p><p className="mt-1 text-xs leading-5 text-on-surface-variant">Paste a public image URL. This does not upload or process an image.</p></div>
    <div className="rounded-2xl bg-surface-container-low p-4 shadow-ambient">
      <div className="mx-auto flex aspect-square w-60 max-w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-container text-center">
        {url && !previewFailed ? <img alt={`Profile photo preview for ${name.trim() || "team member"}`} className="h-full w-full object-cover" onError={() => setPreviewFailed(true)} src={url} /> : <div className="px-6 text-on-surface-variant"><span aria-hidden="true" className="material-symbols-outlined text-4xl">account_circle</span><p className="mt-2 text-sm font-medium text-on-surface">{url ? "Preview unavailable" : "No profile photo"}</p><p className="mt-1 text-xs">{url ? "The URL can still be saved if it is valid." : "Add an image URL to show a preview."}</p></div>}
      </div>
      <label className="mt-4 flex flex-col gap-2" htmlFor="team-member-profile-photo-url"><span className="text-sm font-semibold tracking-tight text-on-surface">Profile photo URL</span><input aria-describedby={error ? "team-member-profile-photo-url-error" : undefined} aria-invalid={error ? true : undefined} className={inputClassName} id="team-member-profile-photo-url" placeholder="https://example.com/profile.jpg" type="url" {...register("profilePhotoUrl", { onChange: () => setPreviewFailed(false) })} /></label>
      {error ? <p className="mt-2 text-xs text-danger" id="team-member-profile-photo-url-error">{error}</p> : null}
    </div>
  </section>;
}
