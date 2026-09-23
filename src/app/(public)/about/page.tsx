import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Manish Jangir",
  description:
    "About Manish Jangir: IIT Guwahati graduate working across machine learning, backend engineering, full-stack systems, and infrastructure.",
};

const path = [
  {
    index: "01",
    title: "Chemical Science",
    text: "B.Tech in Chemical Science and Technology at IIT Guwahati, building the domain foundation that later informed molecular machine-learning work.",
  },
  {
    index: "02",
    title: "Graph Machine Learning",
    text: "Bachelor's thesis work moved from molecular topology to graph neural networks, including SMILES-to-graph preprocessing and custom message-passing models.",
  },
  {
    index: "03",
    title: "Backend Systems",
    text: "The research pipeline expanded into stateless FastAPI inference, request batching, validation at the API edge, and containerized delivery.",
  },
  {
    index: "04",
    title: "Production Engineering",
    text: "Full-stack projects, Docker, CI/CD, AWS tooling, API design, and data workflows broadened the focus from models to the systems around them.",
  },
] as const;

const principles = [
  {
    title: "Validate at boundaries",
    text: "Treat input validation, API contracts, and data integrity as part of the system rather than cleanup work after the fact.",
  },
  {
    title: "Measure before optimizing",
    text: "Use baselines, backtesting, latency measurements, and reproducible experiments to make engineering decisions observable.",
  },
  {
    title: "Build beyond the notebook",
    text: "Carry useful models and ideas into APIs, containers, interfaces, and deployment workflows instead of stopping at experimentation.",
  },
] as const;

const focus = [
  "Software Engineering",
  "Backend Systems",
  "ML Systems",
  "Data & Analytics",
] as const;

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
          About / engineering path
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              From chemical systems to software systems.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
              I&apos;m a B.Tech graduate from IIT Guwahati working across machine learning, backend
              engineering, full-stack development, and data systems. My work has moved from
              graph-based molecular modeling into APIs, deployment workflows, and software built
              around real system constraints.
            </p>
          </div>

          <aside className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--primary)]">
              Current
            </p>
            <p className="mt-4 text-lg font-medium">Consultant I — Data Science &amp; Analytics</p>
            <p className="mt-1 text-sm text-[var(--muted)]">EXL Service · India</p>
            <p className="mt-4 text-sm leading-6 text-[var(--subtle)]">
              Joined through campus placement in June 2026 and currently working through structured
              onboarding and training in SQL, Python, and analytics workflows.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Trajectory
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              One path, increasingly closer to production.
            </h2>
          </div>

          <ol className="mt-10 border-t border-[var(--border)]">
            {path.map((stage) => (
              <li
                key={stage.index}
                className="grid gap-3 border-b border-[var(--border)] py-7 md:grid-cols-[100px_240px_1fr] md:gap-8"
              >
                <span className="font-mono text-xs text-[var(--subtle)]">{stage.index}</span>
                <h3 className="font-medium">{stage.title}</h3>
                <p className="max-w-2xl leading-7 text-[var(--muted)]">{stage.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Engineering approach
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">How I build.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="border border-[var(--border)] p-5">
                <h3 className="font-medium">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
            Current focus
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {focus.map((item) => (
              <span
                key={item}
                className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--muted)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="border border-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              prefetch={false}
            >
              Explore projects
            </Link>
            <Link
              href="/resume"
              className="border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--muted)]"
              prefetch={false}
            >
              View resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
