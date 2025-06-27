import { test, expect } from '@playwright/test';
import {
	expectScrollPosition,
	scrollTo,
	scrollToEnd,
	setScrollPluginOption,
	setScrollPluginOptions,
	wait
} from './support';

test.describe('Offset', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/anchors-1/');
	});

	test('Respects a numeric offset', async ({ page }) => {
		await setScrollPluginOptions(page, { offset: 300 });

		await page.locator('[href="#horizontal"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		const { top } = await target.evaluate((el) => {
			return el.getBoundingClientRect();
		});

		expect(top).toBeCloseTo(300, 1);
	});

	test('Respects a callback for the offset', async ({ page }) => {
		await setScrollPluginOptions(page, { offset: () => 400 });

		await page.locator('[href="#horizontal"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		const { top } = await target.evaluate((el) => {
			return el.getBoundingClientRect();
		});

		expect(top).toBeCloseTo(400, 1);
	});

	test('Passes the target to the offset callback', async ({ page }) => {
		await setScrollPluginOptions(page, {
			offset: (target) => {
				const { height } = target.getBoundingClientRect();
				return Math.floor(height / 2);
			}
		});

		await page.locator('[href="#horizontal"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		const { top, height } = await target.evaluate((el) => {
			return el.getBoundingClientRect();
		});

		expect(top).toBe(Math.floor(height / 2));
	});
});
