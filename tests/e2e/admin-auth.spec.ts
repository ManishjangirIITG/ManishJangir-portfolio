import { expect, test } from "@playwright/test";

test("admin routes expose the login boundary", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("admin can sign in with the CI-only account", async ({ page }) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.CI_ADMIN_PASSWORD;

  test.skip(
    !email || !password,
    "CI admin credentials are required for the authenticated E2E test.",
  );

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Portfolio administration" })).toBeVisible();
  await expect(page.getByText(`Signed in as ${email}.`)).toBeVisible();
});
