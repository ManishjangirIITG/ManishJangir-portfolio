import { describe, expect, it } from "vitest";
import { experienceInput, projectInput, updateInput } from "@/lib/admin/content";

describe("admin content validation", () => {
  it("accepts a valid project", () => {
    expect(
      projectInput.parse({
        title: "Example",
        slug: "example",
        summary: "Summary",
        status: "draft",
        featured: false,
        demoUrl: "",
        repoUrl: "",
      }).slug,
    ).toBe("example");
  });

  it("rejects unsafe slugs", () => {
    expect(() =>
      updateInput.parse({
        title: "Update",
        slug: "../update",
        excerpt: "x",
        body: "body",
        status: "draft",
      }),
    ).toThrow();
  });

  it("accepts a current experience without an end date", () => {
    const parsed = experienceInput.parse({
      organization: "Org",
      role: "Role",
      location: null,
      employmentType: null,
      summary: "Summary",
      status: "draft",
      startDate: "2026-01-01",
      endDate: "",
      isCurrent: true,
    });

    expect(parsed.endDate).toBeNull();
    expect(parsed.isCurrent).toBe(true);
  });

  it("requires an end date for a past experience", () => {
    expect(() =>
      experienceInput.parse({
        organization: "Org",
        role: "Role",
        location: null,
        employmentType: null,
        summary: "Summary",
        status: "draft",
        startDate: "2025-01-01",
        endDate: "",
        isCurrent: false,
      }),
    ).toThrow();
  });

  it("rejects an end date before the start date", () => {
    expect(() =>
      experienceInput.parse({
        organization: "Org",
        role: "Role",
        location: null,
        employmentType: null,
        summary: "Summary",
        status: "draft",
        startDate: "2026-01-01",
        endDate: "2025-12-31",
        isCurrent: false,
      }),
    ).toThrow();
  });
});
