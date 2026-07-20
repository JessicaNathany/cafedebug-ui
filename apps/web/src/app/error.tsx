"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-xl rounded-[--radius-m] border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Button className="mt-5" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
