CREATE TYPE "public"."analytics_event_type" AS ENUM('page_view', 'project_view', 'resume_download');
--> statement-breakpoint
CREATE TABLE "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_type" "analytics_event_type" NOT NULL,
  "path" text NOT NULL,
  "project_slug" text,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "analytics_events_project_slug_check" CHECK (("event_type" = 'project_view' AND "project_slug" IS NOT NULL) OR ("event_type" <> 'project_view' AND "project_slug" IS NULL))
);
--> statement-breakpoint
CREATE INDEX "analytics_events_occurred_at_idx" ON "analytics_events" USING btree ("occurred_at");
--> statement-breakpoint
CREATE INDEX "analytics_events_event_type_occurred_at_idx" ON "analytics_events" USING btree ("event_type", "occurred_at");
--> statement-breakpoint
CREATE INDEX "analytics_events_project_slug_idx" ON "analytics_events" USING btree ("project_slug");
