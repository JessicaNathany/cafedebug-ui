"use client";

import type { UseFormReturn } from "react-hook-form";

import type { UserEditorValues } from "../schemas/user-editor.schema";
import type { UsersRouteError } from "../types/users.types";
import { UsersEditorTopbar } from "./users-editor-topbar";

type UsersEditorFormProps = {
  mode: "new" | "edit";
  form: UseFormReturn<UserEditorValues>;
  isSubmitting: boolean;
  submitError: UsersRouteError | null;
  onCancel: () => void;
  onSubmit: (values: UserEditorValues) => Promise<void>;
};

const labelClassName = "text-sm font-semibold tracking-tight text-on-surface";
const inputClassName =
  "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 hover:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60";

export function UsersEditorForm({
  mode,
  form,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit
}: UsersEditorFormProps) {
  const {
    register,
    formState: { errors }
  } = form;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <UsersEditorTopbar disabled={isSubmitting} mode={mode} onBack={onCancel} />

      {submitError ? (
        <div
          className="border-b border-danger/30 bg-danger/10 px-6 py-3 lg:px-8 xl:px-10"
          role="alert"
        >
          <p className="text-sm font-semibold text-danger">{submitError.title}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{submitError.detail}</p>
          {submitError.traceId ? (
            <p className="mt-1 text-xs text-on-surface-variant">
              Trace ID: {submitError.traceId}
            </p>
          ) : null}
        </div>
      ) : null}

      <form className="flex flex-1 flex-col" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row">
          <main className="w-full px-6 pb-20 pt-8 md:w-[68%] md:p-8 lg:p-12">
            <div className="mx-auto max-w-3xl">
              <div className="grid w-full gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2" htmlFor="user-name">
                  <span className={labelClassName}>Name</span>
                  <input
                    aria-describedby={errors.name?.message ? "user-name-error" : undefined}
                    aria-invalid={errors.name ? true : undefined}
                    className={inputClassName}
                    id="user-name"
                    placeholder="Full name"
                    type="text"
                    {...register("name")}
                  />
                  {errors.name?.message ? (
                    <p className="text-xs text-danger" id="user-name-error">
                      {errors.name.message}
                    </p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2" htmlFor="user-email">
                  <span className={labelClassName}>Email</span>
                  <input
                    aria-describedby={errors.email?.message ? "user-email-error" : undefined}
                    aria-invalid={errors.email ? true : undefined}
                    className={inputClassName}
                    id="user-email"
                    placeholder="name@example.com"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email?.message ? (
                    <p className="text-xs text-danger" id="user-email-error">
                      {errors.email.message}
                    </p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2" htmlFor="user-password">
                  <span className={labelClassName}>Password</span>
                  <input
                    aria-describedby={errors.password?.message ? "user-password-error" : undefined}
                    aria-invalid={errors.password ? true : undefined}
                    autoComplete="new-password"
                    className={inputClassName}
                    id="user-password"
                    placeholder="Enter password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password?.message ? (
                    <p className="text-xs text-danger" id="user-password-error">
                      {errors.password.message}
                    </p>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2" htmlFor="user-confirm-password">
                  <span className={labelClassName}>Confirm Password</span>
                  <input
                    aria-describedby={
                      errors.confirmPassword?.message
                        ? "user-confirm-password-error"
                        : undefined
                    }
                    aria-invalid={errors.confirmPassword ? true : undefined}
                    autoComplete="new-password"
                    className={inputClassName}
                    id="user-confirm-password"
                    placeholder="Confirm password"
                    type="password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword?.message ? (
                    <p className="text-xs text-danger" id="user-confirm-password-error">
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                </label>
              </div>
            </div>
          </main>

          <aside className="w-full border-t border-outline-variant/60 bg-surface-container-lowest px-6 pb-10 pt-8 md:w-[32%] md:border-l md:border-t-0 md:p-8 lg:p-10" />
        </div>

        <footer className="mt-auto border-t border-outline-variant/60 bg-surface-container-lowest p-4">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-2 md:px-4">
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? mode === "new"
                    ? "Creating user..."
                    : "Saving changes..."
                  : mode === "new"
                    ? "Create a User"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
