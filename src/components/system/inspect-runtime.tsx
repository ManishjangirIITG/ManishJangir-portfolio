"use client";

import { useEffect, useState } from "react";
import { useReportWebVitals } from "next/web-vitals";

type CheckState = "checking" | "ok" | "unavailable";
type VitalName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
type VitalSnapshot = Partial<Record<VitalName, number>>;

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

export function InspectRuntime() {
  const [api, setApi] = useState<CheckState>("checking");
  const [database, setDatabase] = useState<CheckState>("checking");
  const [vitals, setVitals] = useState<VitalSnapshot>({});

  useReportWebVitals((metric) => {
    if (!isVitalName(metric.name)) return;
    setVitals((current) => ({ ...current, [metric.name]: metric.value }));
  });

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
    <div className="border-t border-[var(--border)]">
      <dl className="grid sm:grid-cols-3">
        <RuntimeDatum label="api health" value={api} />
        <RuntimeDatum label="database readiness" value={database} />
        <RuntimeDatum
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
  );
}

function RuntimeDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--border)] px-5 py-4 sm:border-r sm:last:border-r-0">
      <dt className="font-mono text-[11px] text-[var(--subtle)]">{label}</dt>
      <dd className="mt-2 font-mono text-xs text-[var(--foreground)]">{value}</dd>
    </div>
  );
}
