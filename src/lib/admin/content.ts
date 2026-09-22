import { and, desc, eq, max } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, contentRevisions, experiences, projects, updates } from "@/db/schema";

export const statusSchema = z.enum(["draft", "published", "archived"]);
export type EntityType = "project" | "experience" | "update";

const optionalUrl = z.union([z.literal(""), z.string().url()]).transform((v) => v || null);
export const projectInput = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(1).max(1000),
  status: statusSchema,
  featured: z.boolean().default(false),
  demoUrl: optionalUrl,
  repoUrl: optionalUrl,
});
export const experienceInput = z
  .object({
    organization: z.string().trim().min(1).max(160),
    role: z.string().trim().min(1).max(160),
    location: z.string().trim().max(160).nullable(),
    employmentType: z.string().trim().max(80).nullable(),
    summary: z.string().trim().min(1).max(3000),
    status: statusSchema,
    startDate: z.string().date(),
    endDate: z.union([z.literal(""), z.string().date()]).transform((value) => value || null),
    isCurrent: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.isCurrent && value.endDate !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Current experience cannot have an end date.",
      });
    }
    if (!value.isCurrent && value.endDate === null) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date is required for a past experience.",
      });
    }
    if (value.endDate !== null && value.endDate < value.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be before start date.",
      });
    }
  });
export const updateInput = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(1).max(1000),
  body: z.string().trim().min(1).max(50000),
  status: statusSchema,
});

export async function getNextSortOrder(entityType: "project" | "experience") {
  if (entityType === "project") {
    const [current] = await db.select({ value: max(projects.sortOrder) }).from(projects);
    return (current?.value ?? -1) + 1;
  }

  const [current] = await db.select({ value: max(experiences.sortOrder) }).from(experiences);
  return (current?.value ?? -1) + 1;
}

export async function recordRevision(
  entityType: EntityType,
  entityId: string,
  snapshot: unknown,
  actorId: string,
) {
  const [current] = await db
    .select({ value: max(contentRevisions.revisionNumber) })
    .from(contentRevisions)
    .where(
      and(eq(contentRevisions.entityType, entityType), eq(contentRevisions.entityId, entityId)),
    );
  await db
    .insert(contentRevisions)
    .values({
      entityType,
      entityId,
      revisionNumber: (current?.value ?? 0) + 1,
      snapshot,
      createdBy: actorId,
    });
}

export async function recordAudit(
  actorId: string,
  action: "create" | "update" | "delete" | "publish" | "archive",
  entityType: EntityType,
  entityId: string,
) {
  await db.insert(auditLogs).values({ actorId, action, entityType, entityId });
}

export async function getEntity(entityType: EntityType, id: string) {
  if (entityType === "project")
    return (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0] ?? null;
  if (entityType === "experience")
    return (await db.select().from(experiences).where(eq(experiences.id, id)).limit(1))[0] ?? null;
  return (await db.select().from(updates).where(eq(updates.id, id)).limit(1))[0] ?? null;
}

export async function getRevisions(entityType: EntityType, entityId: string) {
  return db
    .select()
    .from(contentRevisions)
    .where(
      and(eq(contentRevisions.entityType, entityType), eq(contentRevisions.entityId, entityId)),
    )
    .orderBy(desc(contentRevisions.revisionNumber));
}
