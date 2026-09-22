import type { ReactNode } from "react";
const inputClass =
  "mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]";
export function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-[var(--color-muted)]">
      {label}
      <input
        className={inputClass}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
      />
    </label>
  );
}
export function TextArea({
  label,
  name,
  defaultValue = "",
  rows = 5,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-[var(--color-muted)]">
      {label}
      <textarea
        className={inputClass}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
      />
    </label>
  );
}
export function Status({ value = "draft" }: { value?: string }) {
  return (
    <label className="block text-sm text-[var(--color-muted)]">
      Status
      <select className={inputClass} name="status" defaultValue={value}>
        {["draft", "published", "archived"].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}
export function FormShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-5">
      {children}
      <button
        type="submit"
        className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-[var(--color-background)]"
      >
        Save
      </button>
    </div>
  );
}
