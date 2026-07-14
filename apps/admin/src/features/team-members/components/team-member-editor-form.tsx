"use client";

import type { UseFormReturn } from "react-hook-form";

import type { TeamMemberEditorValues } from "../schemas/team-member.schema";
import type { TeamMembersRouteError } from "../types/team-member.types";
import { TeamMemberEditorTopbar } from "./team-member-editor-topbar";
import { TeamMemberProfilePhotoField } from "./team-member-profile-photo-field";

type TeamMemberEditorFormProps = {
  mode: "new" | "edit";
  form: UseFormReturn<TeamMemberEditorValues>;
  active: boolean;
  isSubmitting: boolean;
  submitError: TeamMembersRouteError | null;
  onCancel: () => void;
  onSubmit: (values: TeamMemberEditorValues) => Promise<void>;
};

const labelClassName = "text-sm font-semibold tracking-tight text-on-surface";
const inputClassName =
  "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 hover:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60";

type FieldProps = {
  form: UseFormReturn<TeamMemberEditorValues>;
  name: Exclude<keyof TeamMemberEditorValues, "isActive">;
  label: string;
  type?: "text" | "email" | "url" | "datetime-local";
  placeholder?: string;
  multiline?: boolean;
  help?: string;
};

function Field({
  form,
  name,
  label,
  type = "text",
  placeholder,
  multiline = false,
  help,
}: FieldProps) {
  const error = form.formState.errors[name]?.message;
  const id = `team-member-${name}`;
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;

  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className={labelClassName}>{label}</span>
      {multiline ? (
        <textarea
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${inputClassName} min-h-32 resize-y`}
          id={id}
          placeholder={placeholder}
          {...form.register(name)}
        />
      ) : (
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={inputClassName}
          id={id}
          placeholder={placeholder}
          step={type === "datetime-local" ? 1 : undefined}
          type={type}
          {...form.register(name)}
        />
      )}
      {error ? (
        <p className="text-xs text-danger" id={`${id}-error`}>
          {error}
        </p>
      ) : help ? (
        <p className="text-xs text-on-surface-variant" id={`${id}-help`}>
          {help}
        </p>
      ) : null}
    </label>
  );
}

export function TeamMemberEditorForm({
  mode,
  form,
  active,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: TeamMemberEditorFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;
  const name = watch("name");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TeamMemberEditorTopbar
        active={active}
        disabled={isSubmitting}
        mode={mode}
        onBack={onCancel}
      />

      {submitError ? (
        <div
          className="border-b border-danger/30 bg-danger/10 px-6 py-3 lg:px-8 xl:px-10"
          role="alert"
        >
          <p className="text-sm font-semibold text-danger">
            {submitError.title}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {submitError.detail}
          </p>
          {submitError.traceId ? (
            <p className="mt-1 text-xs text-on-surface-variant">
              Trace ID: {submitError.traceId}
            </p>
          ) : null}
        </div>
      ) : null}

      <form
        className="flex flex-1 flex-col"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mx-auto grid w-full max-w-screen-2xl flex-1 xl:grid-cols-3">
          <main
            aria-label="Primary team member details"
            className="w-full px-6 pb-10 pt-8 lg:px-8 xl:col-span-2 xl:px-10 xl:pt-12"
          >
            <div className="space-y-10">
              <section className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-on-surface">
                    Identity
                  </h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Set the name and role displayed for this team member.
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    form={form}
                    label="Name"
                    name="name"
                    placeholder="Full name"
                  />
                  <Field
                    form={form}
                    label="Podcast role"
                    name="podcastRole"
                    placeholder="Host, producer, guest"
                  />
                  <Field
                    form={form}
                    label="Nickname"
                    name="nickname"
                    placeholder="Optional preferred name"
                  />
                  <Field
                    form={form}
                    label="Job title"
                    name="jobTitle"
                    placeholder="Optional job title"
                  />
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Profile
                </h2>
                <Field
                  form={form}
                  label="Biography"
                  multiline
                  name="bio"
                  placeholder="Optional biography"
                />
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Contact & social
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    form={form}
                    label="Email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                  />
                  <Field
                    form={form}
                    label="GitHub URL"
                    name="gitHubUrl"
                    placeholder="https://github.com/name"
                    type="url"
                  />
                  <Field
                    form={form}
                    label="LinkedIn URL"
                    name="linkedInUrl"
                    placeholder="https://linkedin.com/in/name"
                    type="url"
                  />
                  <Field
                    form={form}
                    label="Instagram URL"
                    name="instagramUrl"
                    placeholder="https://instagram.com/name"
                    type="url"
                  />
                </div>
              </section>
            </div>
          </main>

          <aside
            aria-label="Team member configuration"
            className="w-full border-t border-outline-variant/60 bg-surface-container-lowest px-6 pb-10 pt-8 lg:px-8 xl:border-l xl:border-t-0 xl:px-10 xl:pt-10"
          >
            <div className="space-y-8">
              <TeamMemberProfilePhotoField form={form} name={name} />
              <section className="space-y-5">
                <h2 className="font-display text-xl font-bold text-on-surface">
                  Configuration
                </h2>
                <Field
                  form={form}
                  help="Use your local date and time; no timezone conversion is applied."
                  label="Joined at"
                  name="joinedAt"
                  type="datetime-local"
                />
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-container-low p-4"
                  htmlFor="team-member-active"
                >
                  <input
                    aria-describedby="team-member-active-help"
                    className="mt-1 h-5 w-5 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    id="team-member-active"
                    type="checkbox"
                    {...register("isActive")}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-on-surface">
                      Active
                    </span>
                    <span
                      className="mt-1 block text-xs leading-5 text-on-surface-variant"
                      id="team-member-active-help"
                    >
                      Active members are available for team presentation.
                    </span>
                  </span>
                </label>
                {errors.isActive?.message ? (
                  <p className="text-xs text-danger">
                    {errors.isActive.message}
                  </p>
                ) : null}
              </section>
            </div>
          </aside>
        </div>

        <footer className="sticky bottom-0 z-20 mt-auto border-t border-outline-variant/60 bg-surface-container-low p-4">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-2 md:px-4">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? mode === "new"
                  ? "Creating team member..."
                  : "Saving changes..."
                : mode === "new"
                  ? "Create Team Member"
                  : "Save Changes"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
