import type { Metadata } from "next";
import { ProjectCard } from "@/components/public/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedProjects } from "@/lib/public/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering case studies across ML systems, backend, full-stack, and deployment.",
};
export default async function ProjectsPage() {
  const rows = await getPublishedProjects();
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Work"
        title="Projects"
        description="Selected systems and experiments, documented with the engineering decisions and verified results behind them."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {rows.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {!rows.length ? (
        <p className="mt-10 text-[var(--muted)]">No published projects yet.</p>
      ) : null}
    </div>
  );
}
