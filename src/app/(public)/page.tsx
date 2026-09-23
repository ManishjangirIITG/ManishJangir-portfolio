import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { EngineeringSystemMap } from "@/components/system/engineering-system-map";
import { InspectSystem } from "@/components/system/inspect-system";
import { getPublicSystemInfo } from "@/lib/system/info";
import { getPublishedContentCounts } from "@/lib/public/stats";
import {
  getFeaturedProjects,
  getPublishedExperiences,
  getPublishedUpdates,
} from "@/lib/public/content";
import { formatDateRange } from "@/lib/public/format";
export default async function HomePage() {
  const [featuredProjects, experience, recentUpdates, publishedCounts] = await Promise.all([
    getFeaturedProjects(3),
    getPublishedExperiences(),
    getPublishedUpdates(3),
    getPublishedContentCounts(),
  ]);
  const system = getPublicSystemInfo();
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_360px] lg:items-end lg:px-8">
        <div className="space-y-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            Software engineering / ML systems
          </p>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Manish Jangir
            </h1>
            <p className="max-w-2xl text-xl leading-8 text-[var(--muted)]">
              I build real software systems across machine learning, backend, full-stack, and
              infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="border border-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              prefetch={false}
            >
              View work
            </Link>
            <Link
              href="/resume"
              className="border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--muted)]"
              prefetch={false}
            >
              Resume
            </Link>
          </div>
        </div>
        <aside className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <p className="font-mono text-xs text-[var(--muted)]">SYSTEM</p>
            <p className="font-mono text-xs text-[var(--primary)]">v{system.version}</p>
          </div>
          <dl className="mt-5 space-y-4 font-mono text-xs">
            <div className="flex justify-between">
              <dt className="text-[var(--subtle)]">published projects</dt>
              <dd>{publishedCounts.projects}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--subtle)]">experience entries</dt>
              <dd>{publishedCounts.experiences}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--subtle)]">published updates</dt>
              <dd>{publishedCounts.updates}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--subtle)]">revision</dt>
              <dd>{system.gitSha ?? "local"}</dd>
            </div>
          </dl>
          <a
            href="#inspect-system"
            className="mt-5 block border-t border-[var(--border)] pt-4 font-mono text-xs text-[var(--primary)]"
          >
            Inspect runtime ↓
          </a>
        </aside>
      </section>
      <EngineeringSystemMap />
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Featured work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Systems, not screenshots.
            </h2>
          </div>
          <Link href="/projects" className="text-sm text-[var(--primary)]" prefetch={false}>
            All projects →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
      <div id="inspect-system">
        <InspectSystem {...system} />
      </div>
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
            Experience
          </p>
          {experience.slice(0, 2).map((item) => (
            <div key={item.id} className="mt-6 grid gap-3 md:grid-cols-[220px_1fr]">
              <p className="font-mono text-xs text-[var(--subtle)]">
                {formatDateRange(item.startDate, item.endDate, item.isCurrent)}
              </p>
              <div>
                <h2 className="text-xl font-semibold">{item.role}</h2>
                <p className="mt-1 text-sm text-[var(--primary)]">{item.organization}</p>
                <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{item.summary}</p>
              </div>
            </div>
          ))}
          <Link href="/experience" className="mt-7 inline-block text-sm text-[var(--primary)]" prefetch={false}>
            Full experience →
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
          Updates
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Build log.</h2>
        {recentUpdates.length ? (
          <div className="mt-7 divide-y divide-[var(--border)]">
            {recentUpdates.map((x) => (
              <Link key={x.id} href={`/updates/${x.slug}`} className="block py-5" prefetch={false}>
                <span className="font-medium">{x.title}</span>
                <p className="mt-1 text-sm text-[var(--muted)]">{x.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-[var(--muted)]">
            No manufactured updates. New entries appear here when published from the CMS.
          </p>
        )}
        <div className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-3xl font-semibold tracking-tight">Want to talk systems?</h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Explore the case studies or use the contact page to get in touch.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block border border-[var(--primary)] px-4 py-2.5 text-sm text-[var(--primary)]"
            prefetch={false}
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
