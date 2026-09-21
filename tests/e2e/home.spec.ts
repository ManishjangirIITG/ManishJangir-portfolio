import { expect, test } from "@playwright/test";

test("homepage renders the foundation shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Manish Jangir" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View work" })).toHaveAttribute("href", "/projects");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});
