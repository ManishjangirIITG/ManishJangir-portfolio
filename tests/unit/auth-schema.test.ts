import { describe, expect, it } from "vitest";

import { adminSessions, adminUsers } from "@/db/schema";

describe("admin auth schema", () => {
  it("defines the user and session tables", () => {
    expect(adminUsers).toBeDefined();
    expect(adminSessions).toBeDefined();
  });
});
