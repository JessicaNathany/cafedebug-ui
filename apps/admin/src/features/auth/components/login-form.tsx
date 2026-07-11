"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useLogin } from "../hooks/use-login";
import { resolveLoginStatusMessage } from "../login-status-message";

const readErrorMessage = (message: unknown): ReactNode =>
  typeof message === "string" && message.length > 0 ? message : null;

const labelClassName =
  "block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { form, formError, onSubmit } = useLogin();
  const initialStatusMessage = resolveLoginStatusMessage(
    searchParams.get("reason") ?? undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting }
  } = form;

  return (
    <section className="mx-auto w-full max-w-[440px] rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-float md:p-10">
      {/* Brand block */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-float">
          <span
            className="material-symbols-outlined text-2xl text-on-primary"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mic
          </span>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface">
          Café Debug
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">Admin Console Login</p>
      </div>

      {initialStatusMessage ? (
        <p
          className="mb-4 rounded-lg bg-surface-container px-3 py-2 text-sm text-on-surface-variant"
          role="status"
        >
          {initialStatusMessage}
        </p>
      ) : null}

      {formError ? (
        <div
          className="mb-4 rounded-lg border border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {formError}
        </div>
      ) : null}

      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        {/* Email field */}
        <div>
          <label className={labelClassName} htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
              aria-hidden="true"
            >
              mail
            </span>
            <input
              id="email"
              autoComplete="email"
              className="w-full rounded-lg border border-outline-variant bg-surface py-3 pl-10 pr-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant transition-all focus:border-primary focus:ring-2 focus:ring-focus-ring disabled:opacity-60"
              disabled={isSubmitting}
              placeholder="admin@cafedebug.com"
              type="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p id="email-error" className="mt-1 text-xs text-danger">
              {readErrorMessage(errors.email.message)}
            </p>
          ) : null}
        </div>

        {/* Password field */}
        <div>
          <label className={labelClassName} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
              aria-hidden="true"
            >
              lock
            </span>
            <input
              id="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-outline-variant bg-surface py-3 pl-10 pr-12 text-sm text-on-surface outline-none placeholder:text-on-surface-variant transition-all focus:border-primary focus:ring-2 focus:ring-focus-ring disabled:opacity-60"
              disabled={isSubmitting}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" className="mt-1 text-xs text-danger">
              {readErrorMessage(errors.password.message)}
            </p>
          ) : null}
        </div>

        {/* Forgot Password — requires backend password reset flow (out of scope V1) */}
        <div className="flex items-center justify-end">
          <a
            href="#"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-strong"
          >
            Forgot Password?
          </a>
        </div>

        <button
          className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-on-primary shadow-md transition-all hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        {isSubmitting ? (
          <p className="text-center text-xs text-on-surface-variant" role="status">
            Validating session...
          </p>
        ) : null}
      </form>

      {/* Security note */}
      <div className="mt-8 border-t border-outline-variant pt-6">
        <p className="text-center text-xs text-on-surface-variant">
          Secure access for authorized administrators only.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className="material-symbols-outlined text-base text-on-surface-variant"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mic
          </span>
          <span className="select-none text-xs text-on-surface-variant/50">|</span>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Café Debug
          </span>
        </div>
      </div>
    </section>
  );
}
