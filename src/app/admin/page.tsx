import { redirect } from "next/navigation";

import { destroyAdminSession, requireAdminSession } from "@/lib/auth/session";

async function signOut() {
  "use server";
  await destroyAdminSession();
  redirect("/admin/login");
}

export default async function AdminPage() {
  const admin = await requireAdminSession();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-[var(--color-primary)]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portfolio administration</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Signed in as {admin.email}. Content management will be added in the next CMS phase.
          </p>
        </div>

        <form action={signOut}>
          <button
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--color-muted)] hover:border-white/20 hover:text-white"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Authentication", "Active"],
          ["Content model", "Ready"],
          ["CRUD", "Phase 4"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm text-[var(--color-muted)]">{label}</p>
            <p className="mt-2 font-medium">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
