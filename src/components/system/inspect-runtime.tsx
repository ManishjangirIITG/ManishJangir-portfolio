"use client";

import dynamic from "next/dynamic";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import type { PublicEnvironment } from "@/lib/system/info";

type CheckState = "standby" | "checking" | "ok" | "unavailable";
type VitalName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
type VitalSnapshot = Partial<Record<VitalName, number>>;

interface InspectRuntimeProps {
  version: string;
  gitSha: string | null;
  environment: PublicEnvironment;
}

const vitalNames = new Set<VitalName>(["CLS", "FCP", "INP", "LCP", "TTFB"]);

const WebVitalsCollector = dynamic(
  () =>
    import("@/components/system/web-vitals-collector").then((module) => module.WebVitalsCollector),
  { ssr: false },
);

function isVitalName(value: string): value is VitalName {
  return vitalNames.has(value as VitalName);
}

function formatVital(name: VitalName, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

export function InspectRuntime({ version, gitSha, environment }: InspectRuntimeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [api, setApi] = useState<CheckState>("standby");
  const [database, setDatabase] = useState<CheckState>("standby");
  const [vitals, setVitals] = useState<VitalSnapshot>({});

  const recordVital = useCallback((name: string, value: number) => {
    if (!isVitalName(name)) return;

    startTransition(() => {
      setVitals((current) => ({ ...current, [name]: value }));
    });
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setActive(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    let mounted = true;
    setApi("checking");
    setDatabase("checking");

    async function inspect() {
      const [healthResult, readinessResult] = await Promise.allSettled([
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/health/ready", { cache: "no-store" }),
      ]);

      if (!mounted) return;

      startTransition(() => {
        setApi(healthResult.status === "fulfilled" && healthResult.value.ok ? "ok" : "unavailable");
        setDatabase(
          readinessResult.status === "fulfilled" && readinessResult.value.ok ? "ok" : "unavailable",
        );
      });
    }

    void inspect();

    return () => {
      mounted = false;
    };
  }, [active]);

  const visibleVitals = (Object.entries(vitals) as Array<[VitalName, number]>).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div ref={containerRef} className="border border-[var(--border)] bg-[var(--surface)]">
      {active ? <WebVitalsCollector onMetric={recordVital} /> : null}

      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <span className="font-mono text-xs text-[var(--muted)]">RUNTIME</span>
        <span className="font-mono text-xs text-[var(--primary)]">
          {active ? "LIVE" : "ON VIEW"}
        </span>
      </div>

      <dl className="grid sm:grid-cols-2">
        <SystemDatum label="application" value={`v${version}`} />
        <SystemDatum label="git sha" value={gitSha ?? "local / unavailable"} />
        <SystemDatum label="environment" value={environment} />
        <SystemDatum label="api health" value={api} />
        <SystemDatum label="database readiness" value={database} />
        <SystemDatum
          label="browser vitals"
          value={
            visibleVitals.length
              ? `${visibleVitals.length} observed`
              : active
                ? "collecting"
                : "on view"
          }
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
            {active
              ? "Web Vitals appear as the browser reports them."
              : "Runtime probes start when this panel approaches the viewport."}
          </p>
        )}
      </div>
    </div>
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
