import { describe, expect, it } from "vitest";

import { env } from "@/lib/env";

describe("environment configuration", () => {
  it("provides valid application configuration", () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBe(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    );

    expect(env.NEXT_PUBLIC_APP_NAME).toBe(
      process.env.NEXT_PUBLIC_APP_NAME ?? "Manish Jangir Portfolio",
    );
  });

  it("provides a valid absolute application URL", () => {
    const url = new URL(env.NEXT_PUBLIC_APP_URL);

    expect(["http:", "https:"]).toContain(url.protocol);
    expect(url.hostname).toBeTruthy();
  });
});
