export function formatMonth(value: string | null) {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  isCurrent = false,
) {
  const start = formatMonth(startDate);
  if (!start) return null;
  return `${start} — ${isCurrent ? "Present" : (formatMonth(endDate) ?? "Present")}`;
}
