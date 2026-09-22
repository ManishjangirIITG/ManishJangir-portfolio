"use client";

import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50";

export function CurrentEmploymentField({
  defaultEndDate = "",
  defaultIsCurrent = false,
}: {
  defaultEndDate?: string | null;
  defaultIsCurrent?: boolean;
}) {
  const [isCurrent, setIsCurrent] = useState(defaultIsCurrent);

  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
        <input
          name="isCurrent"
          type="checkbox"
          checked={isCurrent}
          onChange={(event) => setIsCurrent(event.target.checked)}
          className="size-4 accent-[var(--color-primary)]"
        />
        I currently work here
      </label>

      <label className="block text-sm text-[var(--color-muted)]">
        End date
        <input
          key={isCurrent ? "current" : "ended"}
          className={inputClass}
          name="endDate"
          type="date"
          required={!isCurrent}
          disabled={isCurrent}
          defaultValue={isCurrent ? "" : (defaultEndDate ?? "")}
        />
      </label>
    </div>
  );
}
