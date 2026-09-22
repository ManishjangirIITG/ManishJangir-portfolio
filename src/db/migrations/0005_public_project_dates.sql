ALTER TABLE "projects" ADD COLUMN "start_date" date;
ALTER TABLE "projects" ADD COLUMN "end_date" date;
ALTER TABLE "projects" ADD CONSTRAINT "projects_date_range_check" CHECK ("end_date" IS NULL OR "start_date" IS NULL OR "end_date" >= "start_date");
