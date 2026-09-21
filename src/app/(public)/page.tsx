import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
      <section className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="space-y-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            Engineering portfolio / foundation
          </p>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Manish Jangir
            </h1>
            <p className="max-w-2xl text-xl leading-8 text-[var(--muted)]">
              I build software systems at the intersection of machine learning, backend engineering,
              and infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="border border-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-black"
            >
              View work
            </Link>
            <Link
              href="/resume"
              className="border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
            >
              Resume
            </Link>
          </div>
        </div>

        <aside className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <span className="font-mono text-xs text-[var(--muted)]">SYSTEM</span>
            <span className="font-mono text-xs text-[var(--primary)]">FOUNDATION</span>
          </div>
          <dl className="mt-5 space-y-4 font-mono text-xs">
            <div className="flex justify-between gap-6">
              <dt className="text-[var(--subtle)]">application</dt>
              <dd>0.1.0</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-[var(--subtle)]">database</dt>
              <dd className="text-[var(--subtle)]">phase 2</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-[var(--subtle)]">telemetry</dt>
              <dd className="text-[var(--subtle)]">phase 5</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
