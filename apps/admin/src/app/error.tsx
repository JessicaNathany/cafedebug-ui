"use client";

import { useEffect } from "react";

import { captureException, logger, observabilityEvents } from "@/lib/observability";
import { appRoutes } from "@/lib/routes";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(observabilityEvents.errorBoundaryTriggered, {
      module: "ui",
      action: "global-error-boundary",
      name: error.name,
      message: error.message,
      digest: error.digest
    });

    captureException(error, {
      scope: {
        tags: {
          module: "ui",
          action: "global-error-boundary"
        },
        level: "error"
      },
      context: {
        digest: error.digest
      }
    });
  }, [error]);

  return (
    <html lang="en-US">
      <body className="bg-surface text-on-surface">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
          <div className="space-y-4 rounded-xl bg-surface-container-low p-8 shadow-ambient">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Unexpected error</p>
            <h1 className="text-2xl font-semibold text-on-surface">Something went wrong</h1>
            <p className="text-sm text-on-surface-variant">
              Something unexpected happened. Our observability pipeline has been notified.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
                onClick={reset}
                type="button"
              >
                Try again
              </button>
              <a className="rounded-lg bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface" href={appRoutes.login}>
                Back to login
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
