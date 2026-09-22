import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { experiences, projects, updates } from "@/db/schema";

export type PublishedContentCounts = {
  projects: number;
  experiences: number;
  updates: number;
};

export async function getPublishedContentCounts(): Promise<PublishedContentCounts> {
  const [projectRows, experienceRows, updateRows] = await Promise.all([
    db.select({ value: count() }).from(projects).where(eq(projects.status, "published")),
    db.select({ value: count() }).from(experiences).where(eq(experiences.status, "published")),
    db.select({ value: count() }).from(updates).where(eq(updates.status, "published")),
  ]);

  return {
    projects: projectRows[0]?.value ?? 0,
    experiences: experienceRows[0]?.value ?? 0,
    updates: updateRows[0]?.value ?? 0,
  };
}
