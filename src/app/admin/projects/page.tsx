import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";
export default async function Page() {
  await requireAdminSession();
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt));
  return (
    <AdminShell title="Projects" description="Manage project case studies and publishing state.">
      <Link
        href="/admin/projects/new"
        className="rounded-lg border-white/10 bg-[color-mix(in_srgb,var(--color-primary),white_15%)] px-4 py-2 text-sm font-medium text-[var(--color-background)]"
        prefetch={false}
      >
        New project
      </Link>
      <div className="mt-6 grid gap-3">
        {rows.map((x) => (
          <Link
            key={x.id}
            href={`/admin/projects/${x.id}`}
            className="rounded-xl border border-white/10 p-4 hover:border-white/20"
            prefetch={false}
          >
            <div className="flex justify-between gap-4">
              <span className="font-medium">{x.title}</span>
              <span className="text-xs uppercase text-[var(--color-muted)]">{x.status}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">/{x.slug}</p>
          </Link>
        ))}
        {!rows.length && <p className="text-sm text-[var(--color-muted)]">No projects yet.</p>}
      </div>
    </AdminShell>
  );
}
