"use client";

import { useEffect } from "react";

import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("ui.error_boundary", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-[#F5F5F5]">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FFD1]">
            Application error
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Something went wrong.</h1>
          <p className="mt-4 text-[#A3A3A3]">
            The error has been handled without exposing internal details.
          </p>
          <button
            onClick={reset}
            className="mt-8 w-fit border border-[#262626] px-4 py-2.5 text-sm hover:border-[#737373]"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
