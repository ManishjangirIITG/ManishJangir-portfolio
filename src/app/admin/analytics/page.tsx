import { desc, eq, sql } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdminSession();
  const [totals, projects] = await Promise.all([
    db
      .select({ eventType: analyticsEvents.eventType, count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .groupBy(analyticsEvents.eventType),
    db
      .select({ projectSlug: analyticsEvents.projectSlug, count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "project_view"))
      .groupBy(analyticsEvents.projectSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(10),
  ]);
  const counts = Object.fromEntries(totals.map((row) => [row.eventType, row.count]));

  return (
    <AdminShell
      title="Analytics"
      description="First-party, aggregate portfolio activity. No cookies, user IDs, IP addresses, or user-agent strings are stored."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Page views", counts.page_view ?? 0],
          ["Project views", counts.project_view ?? 0],
          ["Resume downloads", counts.resume_download ?? 0],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <p className="font-mono text-xs uppercase text-[var(--subtle)]">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 border border-[var(--border)] p-5">
        <h2 className="text-lg font-semibold">Project views</h2>
        {projects.length ? (
          <div className="mt-4 divide-y divide-[var(--border)]">
            {projects.map((row) => (
              <div key={row.projectSlug} className="flex justify-between gap-4 py-3 text-sm">
                <span className="font-mono text-[var(--muted)]">{row.projectSlug}</span>
                <span>{row.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">No project views recorded yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
