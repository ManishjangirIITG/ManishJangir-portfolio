import { InspectRuntimeLauncher } from "@/components/system/inspect-runtime-launcher";
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
            Build metadata is rendered directly from the running application. Live dependency checks
            and browser Web Vitals run only when requested.
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <span className="font-mono text-xs text-[var(--muted)]">RUNTIME</span>
            <span className="font-mono text-xs text-[var(--primary)]">ON DEMAND</span>
          </div>

          <dl className="grid sm:grid-cols-3">
            <SystemDatum label="application" value={`v${version}`} />
            <SystemDatum label="git sha" value={gitSha ?? "local / unavailable"} />
            <SystemDatum label="environment" value={environment} />
          </dl>

          <InspectRuntimeLauncher />
        </div>
      </div>
    </section>
  );
}

function SystemDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--border)] px-5 py-4 sm:border-r sm:last:border-r-0">
      <dt className="font-mono text-[11px] text-[var(--subtle)]">{label}</dt>
      <dd className="mt-2 font-mono text-xs text-[var(--foreground)]">{value}</dd>
    </div>
  );
}
