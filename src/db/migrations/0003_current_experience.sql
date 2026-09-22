ALTER TABLE "experiences"
ADD COLUMN "is_current" boolean NOT NULL DEFAULT false;

-- Existing open-ended rows predate the explicit current-role flag. Preserve
-- their meaning by treating a NULL end date as an ongoing experience.
UPDATE "experiences"
SET "is_current" = true
WHERE "end_date" IS NULL;

ALTER TABLE "experiences"
ADD CONSTRAINT "experiences_current_end_date_check"
CHECK (
  ("is_current" = true AND "end_date" IS NULL)
  OR
  ("is_current" = false AND "end_date" IS NOT NULL)
);

ALTER TABLE "experiences"
ADD CONSTRAINT "experiences_end_date_after_start_date_check"
CHECK ("end_date" IS NULL OR "end_date" >= "start_date");
