import type { ReactNode } from "react";
import { AdminNav } from "./admin-nav";
export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <AdminNav />
      <header className="mt-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p>}
      </header>
      <div className="mt-8">{children}</div>
    </main>
  );
}
