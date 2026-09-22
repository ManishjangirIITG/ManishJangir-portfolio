import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { experiences, projects, updates } from "@/db/schema";
import { AdminShell } from "@/components/admin/admin-shell";
import { destroyAdminSession, requireAdminSession } from "@/lib/auth/session";
async function signOut() {
  "use server";
  await destroyAdminSession();
  redirect("/admin/login");
}
export default async function AdminPage() {
  const admin = await requireAdminSession();
  const [[p], [e], [u]] = await Promise.all([
    db.select({ value: count() }).from(projects),
    db.select({ value: count() }).from(experiences),
    db.select({ value: count() }).from(updates),
  ]);
  return (
    <AdminShell title="Portfolio administration" description={`Signed in as ${admin.email}.`}>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Projects", p?.value ?? 0],
          ["Experience", e?.value ?? 0],
          ["Updates", u?.value ?? 0],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-white/10 p-5">
            <p className="text-sm text-[var(--color-muted)]">{l}</p>
            <p className="mt-2 text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </section>
      <form action={signOut} className="mt-8">
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm">Sign out</button>
      </form>
    </AdminShell>
  );
}
