import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedExperiences } from "@/lib/public/content";
import { formatDateRange } from "@/lib/public/format";
export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and engineering work by Manish Jangir.",
};
export default async function ExperiencePage() {
  const rows = await getPublishedExperiences();
  return (
    <div className="mx-auto max-w-5xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Journey"
        title="Experience"
        description="Professional work, responsibilities, and the systems context around them."
      />
      <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {rows.map((item) => (
          <article key={item.id} className="grid gap-5 py-8 md:grid-cols-[220px_1fr]">
            <div className="font-mono text-xs text-[var(--subtle)]">
              {formatDateRange(item.startDate, item.endDate, item.isCurrent)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{item.role}</h2>
              <p className="mt-1 text-sm text-[var(--primary)]">{item.organization}</p>
              {item.location || item.employmentType ? (
                <p className="mt-2 text-xs text-[var(--subtle)]">
                  {[item.employmentType, item.location].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
      {!rows.length ? (
        <p className="mt-10 text-[var(--muted)]">No published experience yet.</p>
      ) : null}
    </div>
  );
}
