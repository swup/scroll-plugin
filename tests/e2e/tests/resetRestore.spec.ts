import { test, expect } from '@playwright/test';
import { expectScrollPosition, scrollTo, scrollToEnd, wait } from './support';

test.describe('Reset & Restore', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/anchors-1/');
	});

	test('Resets the scroll position when navigating', async ({ page }) => {
		await page.locator('[href="#horizontal"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		await page.locator('[href="/anchors-2/"]').first().click();

		await wait(1000);

		await expectScrollPosition(page, { x: 0, y: 0 });
	});

	test('Restores the scroll position when navigating via history', async ({ page }) => {
		await page.locator('[href="#both-axis_tile--last"]').click();
		const target = page.getByTestId('both-axis_tile--last');
		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		await page.getByTestId('link-to-anchors-2-after-both-axis').click();

		await wait(1000);

		await page.goBack();

		await wait(1000);

		const target2 = page.getByTestId('both-axis_tile--last');
		await expect(target2).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target2).toBeInViewport();
	});

	test('Respects `shouldResetScrollPosition: false`', async ({ page }) => {
		await page.locator('[href="#both-axis_tile--last"]').click();
		const target = page.getByTestId('both-axis_tile--last');
		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		await page.getByTestId('link-to-anchors-2-after-both-axis').click();

		await wait(1000);

		await page.locator('[href="/anchors-1/"][data-swup-preserve-scroll]').click();

		await wait(1000);

		const target2 = page.getByTestId('both-axis_tile--last');
		await expect(target2).toBeInViewport();
	});

	test('Restores the scroll positions after a page reload', async ({ page, browserName }) => {
		await page.locator('[href="#vertical_tile--last"]').click();
		const target = page.getByTestId('vertical_tile--last');
		await expect(target).toBeInViewport();

		/** Important! Simple page.reload() won't work in Playwright+FireFox */
		await page.evaluate(() => window.location.reload());

		const target2 = page.getByTestId('vertical_tile--last');
		await expect(target2).toBeInViewport();
	});
});
