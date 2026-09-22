import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedUpdates } from "@/lib/public/content";
export const metadata: Metadata = {
  title: "Updates",
  description: "Notes and updates from Manish Jangir's engineering work.",
};
export default async function UpdatesPage() {
  const rows = await getPublishedUpdates();
  return (
    <div className="mx-auto max-w-5xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Log"
        title="Updates"
        description="Published notes about projects, engineering work, and what I am learning or building."
      />
      <div className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {rows.map((item) => (
          <article key={item.id} className="py-7">
            <p className="font-mono text-xs text-[var(--subtle)]">
              {(item.publishedAt ?? item.createdAt).toLocaleDateString("en", {
                dateStyle: "medium",
              })}
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              <Link href={`/updates/${item.slug}`} className="hover:text-[var(--primary)]">
                {item.title}
              </Link>
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">{item.excerpt}</p>
          </article>
        ))}
      </div>
      {!rows.length ? (
        <div className="mt-10 border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--muted)]">
          No published updates yet. This section is intentionally empty until there is something
          real to publish.
        </div>
      ) : null}
    </div>
  );
}
