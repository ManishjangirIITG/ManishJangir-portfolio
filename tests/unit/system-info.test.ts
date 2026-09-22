import { describe, expect, it } from "vitest";
import { normalizeGitSha } from "@/lib/system/info";

describe("normalizeGitSha", () => {
  it("returns a short safe revision", () => {
    expect(normalizeGitSha("ABCDEF1234567890")).toBe("abcdef1");
  });

  it("does not expose arbitrary environment values", () => {
    expect(normalizeGitSha("branch/main")).toBeNull();
    expect(normalizeGitSha(undefined)).toBeNull();
  });
});
