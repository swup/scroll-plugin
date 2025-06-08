import { test, expect } from "@playwright/test";
import {
  scrollTo,
  scrollToEnd,
  expectScrollPosition,
  sleep,
} from "./support";

test.describe("API", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("runs e2e tests against the Astro fixtures", async ({ page }) => {
	const heading = page.locator('h1');
  	await expect(heading).toContainText('ScrollPlugin');
  });
});
