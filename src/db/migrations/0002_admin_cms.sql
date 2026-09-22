CREATE TYPE "audit_action" AS ENUM ('create', 'update', 'delete', 'publish', 'archive');
CREATE TYPE "content_entity_type" AS ENUM ('project', 'experience', 'update');

CREATE TABLE "content_revisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "entity_type" "content_entity_type" NOT NULL,
  "entity_id" uuid NOT NULL,
  "revision_number" integer NOT NULL,
  "snapshot" jsonb NOT NULL,
  "created_by" uuid NOT NULL REFERENCES "admin_users"("id") ON DELETE RESTRICT,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "content_revisions_entity_revision_unique" ON "content_revisions" ("entity_type","entity_id","revision_number");
CREATE INDEX "content_revisions_entity_idx" ON "content_revisions" ("entity_type","entity_id","created_at");

CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_id" uuid REFERENCES "admin_users"("id") ON DELETE SET NULL,
  "action" "audit_action" NOT NULL,
  "entity_type" "content_entity_type" NOT NULL,
  "entity_id" uuid NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" ("entity_type","entity_id","created_at");
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" ("actor_id","created_at");
