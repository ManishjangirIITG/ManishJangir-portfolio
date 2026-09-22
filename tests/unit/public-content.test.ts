import { describe, expect, it } from "vitest";
import { formatDateRange, formatMonth } from "@/lib/public/format";
describe("public content formatting", () => {
  it("formats month dates without timezone drift", () => {
    expect(formatMonth("2026-06-01")).toBe("Jun 2026");
  });
  it("renders current experience as Present", () => {
    expect(formatDateRange("2026-06-01", null, true)).toBe("Jun 2026 — Present");
  });
  it("renders closed ranges", () => {
    expect(formatDateRange("2025-01-01", "2025-03-01")).toBe("Jan 2025 — Mar 2025");
  });
});
