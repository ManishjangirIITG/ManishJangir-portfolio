interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="text-base leading-7 text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
