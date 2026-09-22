CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "content_status" AS ENUM ('draft', 'published', 'archived');
CREATE TYPE "project_section_type" AS ENUM ('problem', 'architecture', 'approach', 'implementation', 'decisions', 'tradeoffs', 'verified_results');

CREATE TABLE "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "status" "content_status" DEFAULT 'draft' NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "demo_url" text,
  "repo_url" text,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");

CREATE TABLE "project_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "project_id" uuid NOT NULL,
  "type" "project_section_type" NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "project_sections_project_order_unique" ON "project_sections" USING btree ("project_id", "sort_order");

CREATE TABLE "technologies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "technologies_name_unique" ON "technologies" USING btree ("name");
CREATE UNIQUE INDEX "technologies_slug_unique" ON "technologies" USING btree ("slug");

CREATE TABLE "project_technologies" (
  "project_id" uuid NOT NULL,
  "technology_id" uuid NOT NULL,
  CONSTRAINT "project_technologies_project_id_technology_id_pk" PRIMARY KEY("project_id", "technology_id")
);

CREATE TABLE "experiences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization" text NOT NULL,
  "role" text NOT NULL,
  "location" text,
  "employment_type" text,
  "summary" text NOT NULL,
  "status" "content_status" DEFAULT 'draft' NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "experiences_sort_order_unique" ON "experiences" USING btree ("sort_order");

CREATE TABLE "updates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text NOT NULL,
  "body" text NOT NULL,
  "status" "content_status" DEFAULT 'draft' NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "updates_slug_unique" ON "updates" USING btree ("slug");

ALTER TABLE "project_sections" ADD CONSTRAINT "project_sections_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
