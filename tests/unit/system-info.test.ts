import { describe, expect, it } from "vitest";

import { normalizeGitSha, resolvePublicEnvironment } from "@/lib/system/info";

describe("public system information", () => {
  it("normalizes a valid git SHA to seven lowercase characters", () => {
    expect(normalizeGitSha("ABCDEF1234567890")).toBe("abcdef1");
  });

  it("rejects invalid git SHA values", () => {
    expect(normalizeGitSha(undefined)).toBeNull();
    expect(normalizeGitSha("not-a-sha")).toBeNull();
  });

  it("distinguishes Vercel preview deployments from production runtime mode", () => {
    expect(resolvePublicEnvironment("production", "preview")).toBe("preview");
    expect(resolvePublicEnvironment("production", "production")).toBe("production");
  });

  it("falls back to NODE_ENV outside Vercel", () => {
    expect(resolvePublicEnvironment("test", undefined)).toBe("test");
    expect(resolvePublicEnvironment("production", undefined)).toBe("production");
    expect(resolvePublicEnvironment("development", undefined)).toBe("development");
  });
});
