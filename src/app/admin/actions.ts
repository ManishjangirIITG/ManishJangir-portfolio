"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { experiences, projects, updates } from "@/db/schema";
import {
  experienceInput,
  getEntity,
  getNextSortOrder,
  projectInput,
  recordAudit,
  recordRevision,
  updateInput,
  type EntityType,
} from "@/lib/admin/content";
import { requireAdminSession } from "@/lib/auth/session";

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? "");
}

function nullable(fd: FormData, key: string) {
  const value = text(fd, key).trim();
  return value || null;
}

function actionFor(oldStatus: string | undefined, newStatus: string) {
  if (newStatus === "published" && oldStatus !== "published") return "publish" as const;
  if (newStatus === "archived" && oldStatus !== "archived") return "archive" as const;
  return "update" as const;
}

export async function saveProject(fd: FormData) {
  const admin = await requireAdminSession();
  const id = text(fd, "id");
  const input = projectInput.parse({
    title: text(fd, "title"),
    slug: text(fd, "slug"),
    summary: text(fd, "summary"),
    status: text(fd, "status"),
    featured: fd.get("featured") === "on",
    demoUrl: text(fd, "demoUrl"),
    repoUrl: text(fd, "repoUrl"),
  });
  const now = new Date();
  const values = {
    ...input,
    publishedAt: input.status === "published" ? now : null,
    updatedAt: now,
  };

  if (id) {
    const before = await getEntity("project", id);
    if (!before) throw new Error("Project not found");
    await recordRevision("project", id, before, admin.id);
    await db.update(projects).set(values).where(eq(projects.id, id));
    await recordAudit(admin.id, actionFor(before.status, input.status), "project", id);
  } else {
    const sortOrder = await getNextSortOrder("project");
    const [created] = await db
      .insert(projects)
      .values({ ...values, sortOrder })
      .returning();
    if (!created) throw new Error("Project creation failed");
    await recordAudit(admin.id, "create", "project", created.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function saveExperience(fd: FormData) {
  const admin = await requireAdminSession();
  const id = text(fd, "id");
  const isCurrent = fd.get("isCurrent") === "on";
  const input = experienceInput.parse({
    organization: text(fd, "organization"),
    role: text(fd, "role"),
    location: nullable(fd, "location"),
    employmentType: nullable(fd, "employmentType"),
    summary: text(fd, "summary"),
    status: text(fd, "status"),
    startDate: text(fd, "startDate"),
    endDate: isCurrent ? "" : text(fd, "endDate"),
    isCurrent,
  });
  const values = { ...input, updatedAt: new Date() };

  if (id) {
    const before = await getEntity("experience", id);
    if (!before) throw new Error("Experience not found");
    await recordRevision("experience", id, before, admin.id);
    await db.update(experiences).set(values).where(eq(experiences.id, id));
    await recordAudit(admin.id, actionFor(before.status, input.status), "experience", id);
  } else {
    const sortOrder = await getNextSortOrder("experience");
    const [created] = await db
      .insert(experiences)
      .values({ ...values, sortOrder })
      .returning();
    if (!created) throw new Error("Experience creation failed");
    await recordAudit(admin.id, "create", "experience", created.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function saveUpdate(fd: FormData) {
  const admin = await requireAdminSession();
  const id = text(fd, "id");
  const input = updateInput.parse({
    title: text(fd, "title"),
    slug: text(fd, "slug"),
    excerpt: text(fd, "excerpt"),
    body: text(fd, "body"),
    status: text(fd, "status"),
  });
  const now = new Date();
  const values = {
    ...input,
    publishedAt: input.status === "published" ? now : null,
    updatedAt: now,
  };

  if (id) {
    const before = await getEntity("update", id);
    if (!before) throw new Error("Update not found");
    await recordRevision("update", id, before, admin.id);
    await db.update(updates).set(values).where(eq(updates.id, id));
    await recordAudit(admin.id, actionFor(before.status, input.status), "update", id);
  } else {
    const [created] = await db.insert(updates).values(values).returning();
    if (!created) throw new Error("Update creation failed");
    await recordAudit(admin.id, "create", "update", created.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/updates");
  redirect("/admin/updates");
}

export async function deleteContent(fd: FormData) {
  const admin = await requireAdminSession();
  const id = text(fd, "id");
  const type = text(fd, "type") as EntityType;
  const before = await getEntity(type, id);
  if (!before) throw new Error("Content not found");

  await recordRevision(type, id, before, admin.id);
  await recordAudit(admin.id, "delete", type, id);

  if (type === "project") await db.delete(projects).where(eq(projects.id, id));
  else if (type === "experience") await db.delete(experiences).where(eq(experiences.id, id));
  else await db.delete(updates).where(eq(updates.id, id));

  revalidatePath("/admin");
  redirect(type === "experience" ? "/admin/experience" : `/admin/${type}s`);
}
