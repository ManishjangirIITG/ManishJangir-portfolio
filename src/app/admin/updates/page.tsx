import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { updates } from "@/db/schema";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";
export default async function Page() {
  await requireAdminSession();
  const rows = await db.select().from(updates).orderBy(desc(updates.updatedAt));
  return (
    <AdminShell title="Updates">
      <Link
        href="/admin/updates/new"
        className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)]"
      >
        New update
      </Link>
      <div className="mt-6 grid gap-3">
        {rows.map((x) => (
          <Link
            key={x.id}
            href={`/admin/updates/${x.id}`}
            className="rounded-xl border border-white/10 p-4"
          >
            <div className="flex justify-between">
              <span>{x.title}</span>
              <span className="text-xs uppercase text-[var(--color-muted)]">{x.status}</span>
            </div>
          </Link>
        ))}
        {!rows.length && <p className="text-sm text-[var(--color-muted)]">No updates yet.</p>}
      </div>
    </AdminShell>
  );
}
