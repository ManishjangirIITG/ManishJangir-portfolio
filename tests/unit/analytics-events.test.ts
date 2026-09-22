import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "@/lib/analytics/events";

describe("analyticsEventSchema", () => {
  it("accepts a minimal page view", () => {
    expect(analyticsEventSchema.safeParse({ name: "page_view", path: "/projects" }).success).toBe(
      true,
    );
  });

  it("requires a slug for project views", () => {
    expect(
      analyticsEventSchema.safeParse({ name: "project_view", path: "/projects/example" }).success,
    ).toBe(false);
  });

  it("rejects external URLs", () => {
    expect(
      analyticsEventSchema.safeParse({ name: "page_view", path: "https://example.com" }).success,
    ).toBe(false);
  });
});
