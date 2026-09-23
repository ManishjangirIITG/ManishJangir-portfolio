"use client";

import { useState } from "react";

const stages = [
  {
    id: "chemical-science",
    index: "01",
    label: "Chemical Science",
    detail:
      "Chemical Science & Technology at IIT Guwahati established the domain foundation behind later molecular ML work.",
  },
  {
    id: "graph-ml",
    index: "02",
    label: "Graph ML",
    detail:
      "Molecular spectra research moved the work into graph construction, MPNNs, model optimization, and validated ML pipelines.",
  },
  {
    id: "backend",
    index: "03",
    label: "Backend Systems",
    detail:
      "FastAPI inference services and full-stack application work extended models and product logic behind explicit API boundaries.",
  },
  {
    id: "infrastructure",
    index: "04",
    label: "Infrastructure",
    detail:
      "Docker, CI/CD, Linux, and deployment-oriented engineering connect application code to repeatable production workflows.",
  },
] as const;

type StageId = (typeof stages)[number]["id"];

export function EngineeringSystemMap() {
  const [activeId, setActiveId] = useState<StageId>(stages[0].id);
  const activeStage = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <section className="border-y border-[var(--border)]" aria-labelledby="system-map-title">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
            Engineering system map
          </p>
          <h2 id="system-map-title" className="mt-3 text-3xl font-semibold tracking-tight">
            One path, increasingly closer to production.
          </h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Select a stage to inspect how the work progressed from domain knowledge to models,
            services, and infrastructure.
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="relative grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => {
              const isActive = stage.id === activeStage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveId(stage.id)}
                  className={`min-h-36 bg-[var(--background)] p-5 text-left transition-colors hover:bg-[var(--surface)] ${
                    isActive ? "shadow-[inset_0_-2px_0_var(--primary)]" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-[var(--subtle)]">{stage.index}</span>
                  <span
                    className={`mt-8 block font-medium ${isActive ? "text-[var(--primary)]" : ""}`}
                  >
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-6" aria-live="polite">
            <p className="font-mono text-xs text-[var(--primary)]">ACTIVE / {activeStage.index}</p>
            <h3 className="mt-4 text-xl font-semibold">{activeStage.label}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{activeStage.detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
