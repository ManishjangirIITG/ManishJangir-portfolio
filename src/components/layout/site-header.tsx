import Link from "next/link";
import { siteConfig } from "@/config/site";
export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          MJ<span className="text-[var(--primary)]">.</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden gap-5 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="font-mono text-xs text-[var(--subtle)]">portfolio / public</span>
      </div>
    </header>
  );
}
