import { test, expect } from "@playwright/test";

test.describe("API", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Runs e2e tests against the Astro playground", async ({ page }) => {
  	await expect(page.getByTestId('title')).toContainText('@swup/scroll-plugin');
  });
});
