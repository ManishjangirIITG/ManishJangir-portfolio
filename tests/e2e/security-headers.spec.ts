import { expect, test } from "@playwright/test";

test("public responses include the security baseline", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();

  const headers = response.headers();
  const csp = headers["content-security-policy"];

  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-permitted-cross-domain-policies"]).toBe("none");
  expect(headers["permissions-policy"]).toContain("camera=()");
});

test("admin responses are not cacheable or indexable", async ({ request }) => {
  const response = await request.get("/admin/login");
  expect(response.ok()).toBeTruthy();

  const headers = response.headers();
  const cacheControl = headers["cache-control"] ?? "";

  expect(cacheControl).toMatch(/\b(no-store|no-cache)\b/);
  expect(cacheControl).not.toMatch(/\bpublic\b/);

  expect(headers["x-robots-tag"]).toContain("noindex");
  expect(headers["x-robots-tag"]).toContain("nofollow");
});
