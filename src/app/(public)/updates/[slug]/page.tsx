import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedUpdateBySlug } from "@/lib/public/content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getPublishedUpdateBySlug((await params).slug);
  return item ? { title: item.title, description: item.excerpt } : { title: "Update not found" };
}
export default async function UpdatePage({ params }: Props) {
  const item = await getPublishedUpdateBySlug((await params).slug);
  if (!item) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-6 lg:px-8">
      <Link href="/updates" className="font-mono text-xs text-[var(--muted)]">
        ← updates
      </Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{item.excerpt}</p>
      <div className="mt-10 whitespace-pre-line border-t border-[var(--border)] pt-10 leading-8 text-[var(--muted)]">
        {item.body}
      </div>
    </article>
  );
}
