"use client";

import { useEffect } from "react";

import { logger } from "@/lib/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("ui.error_boundary", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FFD1]">
        Application error
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Something went wrong.</h1>
      <p className="mt-4 text-[#A3A3A3]">
        The error has been handled without exposing internal details.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 w-fit border border-[#262626] px-4 py-2.5 text-sm hover:border-[#737373]"
      >
        Try again
      </button>
    </section>
  );
}
