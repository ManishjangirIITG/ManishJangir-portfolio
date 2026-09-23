"use client";

import { useCallback, useEffect, useState } from "react";
import { useReportWebVitals } from "next/web-vitals";
import type { PublicEnvironment } from "@/lib/system/info";

type CheckState = "checking" | "ok" | "unavailable";
type VitalName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";

type VitalSnapshot = Partial<Record<VitalName, number>>;

interface InspectSystemProps {
  version: string;
  gitSha: string | null;
  environment: PublicEnvironment;
}

const vitalNames = new Set<VitalName>(["CLS", "FCP", "INP", "LCP", "TTFB"]);

function isVitalName(value: string): value is VitalName {
  return vitalNames.has(value as VitalName);
}

function formatVital(name: VitalName, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

async function checkEndpoint(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    await response.text();
    return response.ok;
  } catch {
    return false;
  }
}

export function InspectSystem({ version, gitSha, environment }: InspectSystemProps) {
  const [api, setApi] = useState<CheckState>("checking");
  const [database, setDatabase] = useState<CheckState>("checking");
  const [vitals, setVitals] = useState<VitalSnapshot>({});

  const handleWebVital = useCallback((metric: { name: string; value: number }) => {
    const name = metric.name;

    if (!isVitalName(name)) return;

    setVitals((current) => {
      if (current[name] === metric.value) return current;

      return {
        ...current,
        [name]: metric.value,
      };
    });
  }, []);

  useReportWebVitals(handleWebVital);

  useEffect(() => {
    let active = true;

    async function inspect() {
      const [apiOk, databaseOk] = await Promise.all([
        checkEndpoint("/api/health"),
        checkEndpoint("/api/health/ready"),
      ]);

      if (!active) return;
      setApi(apiOk ? "ok" : "unavailable");
      setDatabase(databaseOk ? "ok" : "unavailable");
    }

    void inspect();
    return () => {
      active = false;
    };
  }, []);

  const visibleVitals = (Object.entries(vitals) as Array<[VitalName, number]>).sort(([a], [b]) =>
    a.localeCompare(b),
  );

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

        <div className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <span className="font-mono text-xs text-[var(--muted)]">RUNTIME</span>
            <span className="font-mono text-xs text-[var(--primary)]">LIVE</span>
          </div>
          <dl className="grid sm:grid-cols-2">
            <SystemDatum label="application" value={`v${version}`} />
            <SystemDatum label="git sha" value={gitSha ?? "local / unavailable"} />
            <SystemDatum label="environment" value={environment} />
            <SystemDatum label="api health" value={api} />
            <SystemDatum label="database readiness" value={database} />
            <SystemDatum
              label="browser vitals"
              value={visibleVitals.length ? `${visibleVitals.length} observed` : "collecting"}
            />
          </dl>

          <div className="border-t border-[var(--border)] px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--subtle)]">
              Current browser session
            </p>
            {visibleVitals.length ? (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
                {visibleVitals.map(([name, value]) => (
                  <span key={name}>
                    <span className="text-[var(--subtle)]">{name}</span> {formatVital(name, value)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--subtle)]">
                Web Vitals appear as the browser reports them.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--border)] px-5 py-4 sm:odd:border-r">
      <dt className="font-mono text-[11px] text-[var(--subtle)]">{label}</dt>
      <dd className="mt-2 font-mono text-xs text-[var(--foreground)]">{value}</dd>
    </div>
  );
}
