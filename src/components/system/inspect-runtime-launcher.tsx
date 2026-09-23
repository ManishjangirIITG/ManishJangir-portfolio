"use client";

import { useState, type ComponentType } from "react";

type LoadState = "idle" | "loading" | "ready" | "error";

export function InspectRuntimeLauncher() {
  const [state, setState] = useState<LoadState>("idle");
  const [RuntimeComponent, setRuntimeComponent] = useState<ComponentType | null>(null);

  async function startInspection() {
    if (state === "loading" || state === "ready") return;

    setState("loading");

    try {
      const runtimeModule = await import("@/components/system/inspect-runtime");
      setRuntimeComponent(() => runtimeModule.InspectRuntime);
      setState("ready");
    } catch {
      setState("error");
    }
  }

  if (RuntimeComponent) {
    return <RuntimeComponent />;
  }

  return (
    <div className="px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--subtle)]">
            Live probes
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Check API health, database readiness, and Web Vitals for this browser session.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void startInspection()}
          disabled={state === "loading"}
          className="shrink-0 border border-[var(--primary)] px-4 py-2.5 font-mono text-xs text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-black disabled:cursor-wait disabled:opacity-60"
        >
          {state === "loading"
            ? "Starting…"
            : state === "error"
              ? "Retry inspection"
              : "Run live inspection"}
        </button>
      </div>

      {state === "error" ? (
        <p role="status" className="mt-3 text-xs text-[var(--subtle)]">
          Live inspection could not be loaded. Static build information remains available above.
        </p>
      ) : null}
    </div>
  );
}
