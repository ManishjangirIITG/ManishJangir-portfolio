import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact | Manish Jangir",
  description:
    "Contact Manish Jangir about software engineering, backend systems, machine learning, and data engineering work.",
};

const channels = [
  {
    label: "LinkedIn",
    description: "Professional messages and opportunities",
    href: siteConfig.links.linkedin,
  },
  {
    label: "GitHub",
    description: "Projects, repositories, and engineering work",
    href: siteConfig.links.github,
  },
] as const;

const topics = [
  "Software Engineering",
  "Backend Systems",
  "ML Systems",
  "Data & Analytics",
] as const;

export default function ContactPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
          Contact / public channels
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Let&apos;s talk about useful systems.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              For professional conversations around software engineering, backend systems, machine
              learning, data work, or the projects on this site, use the public professional
              channels below. Private contact details are intentionally not exposed.
            </p>
          </div>

          <aside className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--primary)]">
              Context
            </p>
            <p className="mt-4 text-lg font-medium">Currently at EXL Service</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Consultant I in Data Science &amp; Analytics, with a background spanning GNN research,
              backend APIs, full-stack development, and data workflows.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[220px_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
                Reach me
              </p>
            </div>

            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-2 py-5 sm:grid-cols-[140px_1fr_auto] sm:items-center sm:gap-6"
                >
                  <span className="font-mono text-xs text-[var(--subtle)]">{channel.label}</span>
                  <span className="text-sm text-[var(--muted)] group-hover:text-[var(--foreground)]">
                    {channel.description}
                  </span>
                  <span aria-hidden="true" className="text-[var(--primary)]">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Relevant topics
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Where my work is concentrated.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--muted)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="border-l-0 border-[var(--border)] lg:border-l lg:pl-10">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Before reaching out
            </p>
            <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
              The project case studies contain more context on architecture, implementation choices,
              technologies, and verified results. For professional outreach, LinkedIn is the
              preferred public channel. Private contact details are intentionally not published
              here.
            </p>
            <Link
              href="/projects"
              className="mt-6 inline-block text-sm font-medium text-[var(--primary)]"
            >
              Explore projects →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
