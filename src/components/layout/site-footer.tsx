export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-[var(--subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>Manish Jangir</span>
        <span className="font-mono">built as a production system, not a static profile</span>
      </div>
    </footer>
  );
}
