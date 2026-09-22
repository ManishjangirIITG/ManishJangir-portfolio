import type { Metadata } from "next";
import { ProjectViewTracker } from "@/components/analytics/project-view-tracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/public/content";
import { formatDateRange } from "@/lib/public/format";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getPublishedProjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublishedProjectBySlug((await params).slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "Project not found" };
}
export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProjectBySlug((await params).slug);
  if (!project) notFound();
  const range = formatDateRange(project.startDate, project.endDate);
  return (
    <>
      <ProjectViewTracker slug={project.slug} />
      <article className="mx-auto max-w-4xl px-5 py-20 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="font-mono text-xs text-[var(--muted)] hover:text-[var(--primary)]"
        >
          ← all projects
        </Link>
        <header className="mt-8 border-b border-[var(--border)] pb-10">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--primary)]">
            <span>Engineering case study</span>
            {range ? (
              <>
                <span className="text-[var(--subtle)]">/</span>
                <span className="text-[var(--muted)]">{range}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech.slug}
                className="border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--muted)]"
              >
                {tech.name}
              </span>
            ))}
          </div>
          {project.demoUrl || project.repoUrl ? (
            <div className="mt-7 flex gap-4 text-sm">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  rel="noreferrer"
                  target="_blank"
                  className="text-[var(--primary)]"
                >
                  Live demo ↗
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  rel="noreferrer"
                  target="_blank"
                  className="text-[var(--primary)]"
                >
                  Repository ↗
                </a>
              ) : null}
            </div>
          ) : null}
        </header>
        <div className="divide-y divide-[var(--border)]">
          {project.sections.map((section) => (
            <section key={section.id} className="grid gap-5 py-10 md:grid-cols-[180px_1fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--primary)]">
                  {section.type.replaceAll("_", " ")}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                <p className="mt-4 whitespace-pre-line leading-8 text-[var(--muted)]">
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
