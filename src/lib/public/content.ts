import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  experiences,
  projects,
  projectSections,
  projectTechnologies,
  technologies,
  updates,
} from "@/db/schema";

const published = "published" as const;

export async function getPublishedProjects() {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.status, published))
    .orderBy(asc(projects.sortOrder), desc(projects.publishedAt), asc(projects.title));

  return Promise.all(
    rows.map(async (project) => ({
      ...project,
      technologies: await db
        .select({ name: technologies.name, slug: technologies.slug })
        .from(projectTechnologies)
        .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
        .where(eq(projectTechnologies.projectId, project.id))
        .orderBy(asc(technologies.name)),
    })),
  );
}

export async function getFeaturedProjects(limit = 3) {
  const all = await getPublishedProjects();
  const featured = all.filter((project) => project.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPublishedProjectBySlug(slug: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, published)))
    .limit(1);
  if (!project) return null;

  const [sections, tech] = await Promise.all([
    db
      .select()
      .from(projectSections)
      .where(eq(projectSections.projectId, project.id))
      .orderBy(asc(projectSections.sortOrder)),
    db
      .select({ name: technologies.name, slug: technologies.slug })
      .from(projectTechnologies)
      .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
      .where(eq(projectTechnologies.projectId, project.id))
      .orderBy(asc(technologies.name)),
  ]);
  return { ...project, sections, technologies: tech };
}

export async function getPublishedExperiences() {
  return db
    .select()
    .from(experiences)
    .where(eq(experiences.status, published))
    .orderBy(asc(experiences.sortOrder), desc(experiences.startDate));
}

export async function getPublishedUpdates(limit?: number) {
  const query = db
    .select()
    .from(updates)
    .where(eq(updates.status, published))
    .orderBy(desc(updates.publishedAt), desc(updates.createdAt));
  return limit ? query.limit(limit) : query;
}

export async function getPublishedUpdateBySlug(slug: string) {
  const [update] = await db
    .select()
    .from(updates)
    .where(and(eq(updates.slug, slug), eq(updates.status, published)))
    .limit(1);
  return update ?? null;
}
