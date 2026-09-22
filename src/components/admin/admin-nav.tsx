import Link from "next/link";

const adminNavigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/updates", label: "Updates" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/audit", label: "Audit log" },
] as const;

export function AdminNav() {
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-2 text-sm">
      {adminNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-white/10 px-3 py-2 text-[var(--color-muted)] hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
