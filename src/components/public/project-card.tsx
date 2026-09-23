import Link from "next/link";
import { formatDateRange } from "@/lib/public/format";

type ProjectCardProps = {
  project: {
    slug: string;
    title: string;
    summary: string;
    startDate: string | null;
    endDate: string | null;
    technologies: { name: string; slug: string }[];
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const range = formatDateRange(project.startDate, project.endDate);
  return (
    <article className="group border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--subtle)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--primary)]">
          Case study
        </p>
        {range ? <span className="font-mono text-xs text-[var(--subtle)]">{range}</span> : null}
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">
        <Link
          href={`/projects/${project.slug}`}
          className="group-hover:text-[var(--primary)]"
          prefetch={false}
        >
          {project.title}
        </Link>
      </h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech.slug}
            className="border border-[var(--border)] px-2 py-1 font-mono text-[11px] text-[var(--muted)]"
          >
            {tech.name}
          </span>
        ))}
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="mt-6 inline-block text-sm font-medium text-[var(--primary)]"
        prefetch={false}
      >
        Read case study →
      </Link>
    </article>
  );
}
