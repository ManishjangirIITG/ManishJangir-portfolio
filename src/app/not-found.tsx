import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-5 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found.</h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">The requested resource does not exist.</p>
      <Link
        href="/"
        className="mt-8 w-fit border border-[var(--border)] px-4 py-2.5 text-sm hover:border-[var(--muted)]"
        prefetch={false}
      >
        Return home
      </Link>
    </div>
  );
}
