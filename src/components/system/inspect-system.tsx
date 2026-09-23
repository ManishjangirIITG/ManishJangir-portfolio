import { InspectRuntime } from "@/components/system/inspect-runtime";
import type { PublicEnvironment } from "@/lib/system/info";

interface InspectSystemProps {
  version: string;
  gitSha: string | null;
  environment: PublicEnvironment;
}

export function InspectSystem({ version, gitSha, environment }: InspectSystemProps) {
  return (
    <section
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8"
      aria-labelledby="inspect-title"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
            Inspect system
          </p>
          <h2 id="inspect-title" className="mt-3 text-3xl font-semibold tracking-tight">
            The portfolio exposes its own safe runtime state.
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            These values come from the running application and this browser session. No traffic,
            uptime, or performance numbers are fabricated.
          </p>
        </div>

        <InspectRuntime version={version} gitSha={gitSha} environment={environment} />
      </div>
    </section>
  );
}
