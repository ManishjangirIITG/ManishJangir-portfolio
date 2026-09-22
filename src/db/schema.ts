import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const contentStatus = pgEnum("content_status", ["draft", "published", "archived"]);

export const projectSectionType = pgEnum("project_section_type", [
  "problem",
  "architecture",
  "approach",
  "implementation",
  "decisions",
  "tradeoffs",
  "verified_results",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    status: contentStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    demoUrl: text("demo_url"),
    repoUrl: text("repo_url"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_sort_order_idx").on(table.sortOrder),
    check(
      "projects_date_range_check",
      sql`${table.endDate} IS NULL OR ${table.startDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
  ],
);

export const projectSections = pgTable(
  "project_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    type: projectSectionType("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("project_sections_project_order_unique").on(table.projectId, table.sortOrder),
  ],
);

export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("technologies_name_unique").on(table.name),
    uniqueIndex("technologies_slug_unique").on(table.slug),
  ],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.technologyId] })],
);

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organization: text("organization").notNull(),
    role: text("role").notNull(),
    location: text("location"),
    employmentType: text("employment_type"),
    summary: text("summary").notNull(),
    status: contentStatus("status").notNull().default("draft"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("experiences_sort_order_idx").on(table.sortOrder),
    check(
      "experiences_current_end_date_check",
      sql`(${table.isCurrent} = true AND ${table.endDate} IS NULL) OR (${table.isCurrent} = false AND ${table.endDate} IS NOT NULL)`,
    ),
    check(
      "experiences_end_date_after_start_date_check",
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
  ],
);

export const updates = pgTable(
  "updates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    status: contentStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("updates_slug_unique").on(table.slug)],
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("admin_users_email_unique").on(table.email)],
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("admin_sessions_token_hash_unique").on(table.tokenHash),
    uniqueIndex("admin_sessions_user_id_unique").on(table.userId),
  ],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  sections: many(projectSections),
  technologies: many(projectTechnologies),
}));

export const projectSectionsRelations = relations(projectSections, ({ one }) => ({
  project: one(projects, {
    fields: [projectSections.projectId],
    references: [projects.id],
  }),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projects: many(projectTechnologies),
}));

export const projectTechnologiesRelations = relations(projectTechnologies, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechnologies.projectId],
    references: [projects.id],
  }),
  technology: one(technologies, {
    fields: [projectTechnologies.technologyId],
    references: [technologies.id],
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  sessions: many(adminSessions),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  user: one(adminUsers, {
    fields: [adminSessions.userId],
    references: [adminUsers.id],
  }),
}));

export const analyticsEventType = pgEnum("analytics_event_type", [
  "page_view",
  "project_view",
  "resume_download",
]);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventType: analyticsEventType("event_type").notNull(),
    path: text("path").notNull(),
    projectSlug: text("project_slug"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("analytics_events_occurred_at_idx").on(table.occurredAt),
    index("analytics_events_event_type_occurred_at_idx").on(table.eventType, table.occurredAt),
    index("analytics_events_project_slug_idx").on(table.projectSlug),
    check(
      "analytics_events_project_slug_check",
      sql`(${table.eventType} = 'project_view' AND ${table.projectSlug} IS NOT NULL) OR (${table.eventType} <> 'project_view' AND ${table.projectSlug} IS NULL)`,
    ),
  ],
);

export const auditAction = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "publish",
  "archive",
]);
export const contentEntityType = pgEnum("content_entity_type", ["project", "experience", "update"]);

export const contentRevisions = pgTable(
  "content_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: contentEntityType("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    revisionNumber: integer("revision_number").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("content_revisions_entity_revision_unique").on(
      table.entityType,
      table.entityId,
      table.revisionNumber,
    ),
    index("content_revisions_entity_idx").on(table.entityType, table.entityId, table.createdAt),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => adminUsers.id, { onDelete: "set null" }),
    action: auditAction("action").notNull(),
    entityType: contentEntityType("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_entity_idx").on(table.entityType, table.entityId, table.createdAt),
    index("audit_logs_actor_idx").on(table.actorId, table.createdAt),
  ],
);
