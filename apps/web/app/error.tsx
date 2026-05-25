"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[FuzzyDashboard] uncaught error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Algo fallo al evaluar el caso</h1>
        <p className="text-sm text-muted-foreground">
          El motor difuso lanzo un error inesperado. Puedes intentar recargar el caso por defecto.
        </p>
      </div>
      <pre className="max-w-full overflow-x-auto rounded-md border bg-muted/60 px-3 py-2 text-left text-[11px] text-muted-foreground">
        {error.message}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Reintentar
      </button>
    </main>
  );
}
