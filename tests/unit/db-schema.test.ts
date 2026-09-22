import { describe, expect, it } from "vitest";

import {
  contentStatus,
  experiences,
  projectSections,
  projectTechnologies,
  projects,
  technologies,
  updates,
} from "@/db/schema";

describe("database schema", () => {
  it("defines the Phase 2 content tables", () => {
    expect(Object.keys(projects)).toContain("id");
    expect(Object.keys(projectSections)).toContain("projectId");
    expect(Object.keys(technologies)).toContain("slug");
    expect(Object.keys(projectTechnologies)).toContain("projectId");
    expect(Object.keys(experiences)).toContain("organization");
    expect(Object.keys(updates)).toContain("publishedAt");
  });

  it("defines the supported content states", () => {
    expect(contentStatus.enumValues).toEqual(["draft", "published", "archived"]);
  });
});
