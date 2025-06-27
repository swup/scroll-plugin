import { test, expect } from '@playwright/test';
import { wait } from './support';

test.describe('API', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/anchors-1/');
	});

	test('Scrolls to anchors on click', async ({ page }) => {
		await page.locator('[href="#horizontal"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();
	});

	test('Scrolls to a nested anchor in a vertical scroll container', async ({ page }) => {
		await page.locator('[href="#vertical_tile--last"]').click();

		await wait(1000);

		const target = page.getByTestId('vertical_tile--last');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();
	});

	test('Scrolls to a nested anchor in an horizontal scroll container', async ({ page }) => {
		await page.locator('[href="#horizontal_tile--15"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal_tile--15');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();
	});

	test('Scrolls to a nested anchor in a both-axis scroll container', async ({ page }) => {
		await page.locator('[href="#both-axis_tile--last"]').click();

		await wait(1000);

		const target = page.getByTestId('both-axis_tile--last');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();
	});

	test('Scrolls to an anchor on a different page', async ({ page }) => {
		await page.locator('[href="/anchors-2/#both-axis"]').click();

		await wait(1000);

		const target = page.getByTestId('both-axis');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();
	});
});
