import { expect, test } from "@playwright/test";

test("liveness endpoint exposes only safe runtime information", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");

  const body = (await response.json()) as Record<string, unknown>;
  expect(body.status).toBe("ok");
  expect(body.service).toBe("portfolio-web");
  expect(body).not.toHaveProperty("databaseUrl");
  expect(body).not.toHaveProperty("environment");
  expect(JSON.stringify(body)).not.toMatch(/password|secret|token/i);
});

test("readiness endpoint verifies PostgreSQL", async ({ request }) => {
  const response = await request.get("/api/health/ready");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");

  const body = (await response.json()) as {
    status: string;
    checks?: { database?: string };
    durationMs?: number;
  };
  expect(body.status).toBe("ready");
  expect(body.checks?.database).toBe("ok");
  expect(body.durationMs).toEqual(expect.any(Number));
});

test("analytics rejects malformed and cross-origin events", async ({ request }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;

  if (typeof baseURL !== "string") {
    throw new Error("Playwright baseURL is required for analytics tests");
  }

  const origin = new URL(baseURL).origin;

  const missingOrigin = await request.post("/api/analytics/events", {
    data: { name: "page_view", path: "/" },
  });

  expect(missingOrigin.status()).toBe(403);

  const malformed = await request.post("/api/analytics/events", {
    headers: {
      Origin: origin,
    },
    data: { name: "made_up_event", path: "/" },
  });

  expect(malformed.status()).toBe(400);

  const crossOrigin = await request.post("/api/analytics/events", {
    headers: {
      Origin: "https://example.invalid",
    },
    data: { name: "page_view", path: "/" },
  });

  expect(crossOrigin.status()).toBe(403);
});
