-- sort_order is presentation metadata, not a unique business identifier.
DROP INDEX IF EXISTS "experiences_sort_order_unique";

CREATE INDEX IF NOT EXISTS "experiences_sort_order_idx"
  ON "experiences" ("sort_order");

CREATE INDEX IF NOT EXISTS "projects_sort_order_idx"
  ON "projects" ("sort_order");
