import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/resume",
  "/updates",
  "/contact",
] as const;

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );

  expect(
    blocking,
    blocking
      .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`)
      .join("\n"),
  ).toEqual([]);
}

for (const route of publicRoutes) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expectNoSeriousAccessibilityViolations(page);
  });
}

test("public navigation does not emit browser errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  await page.goto("/");

  const projectsLink = page.getByRole("link", {
    name: "View work",
    exact: true,
  });

  await expect(projectsLink).toBeVisible();
  await expect(projectsLink).toHaveAttribute("href", "/projects");

  await page.goto("/projects");

  await expect(page).toHaveURL(/\/projects$/);

  expect(failedResponses).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("unknown public routes use the application 404", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
});
