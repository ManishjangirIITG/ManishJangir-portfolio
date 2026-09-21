import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";

describe("site configuration", () => {
  it("contains the planned public navigation", () => {
    expect(siteConfig.navigation.map((item) => item.href)).toEqual([
      "/about",
      "/experience",
      "/projects",
      "/resume",
      "/updates",
      "/contact",
    ]);
  });
});
