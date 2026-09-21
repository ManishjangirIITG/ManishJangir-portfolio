import { describe, expect, it } from "vitest";

import { env } from "@/lib/env";

describe("environment configuration", () => {
  it("provides safe development defaults", () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("Manish Jangir Portfolio");
  });
});
