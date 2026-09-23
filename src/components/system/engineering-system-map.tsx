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

export function EngineeringSystemMap() {
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
            Open a stage to inspect how the work progressed from domain knowledge to models,
            services, and infrastructure.
          </p>
        </div>

        <div className="mt-9 grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <details key={stage.id} open={index === 0} className="group bg-[var(--background)]">
              <summary className="min-h-36 cursor-pointer list-none p-5 text-left transition-colors hover:bg-[var(--surface)] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[var(--subtle)]">{stage.index}</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-[var(--subtle)] group-open:text-[var(--primary)]"
                  >
                    +
                  </span>
                </span>
                <span className="mt-8 block font-medium group-open:text-[var(--primary)]">
                  {stage.label}
                </span>
              </summary>

              <div className="border-t border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="font-mono text-xs text-[var(--primary)]">STAGE / {stage.index}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{stage.detail}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
