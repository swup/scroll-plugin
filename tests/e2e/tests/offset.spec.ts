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

	test('Accepts an object for the offset callback', async ({ page }) => {
		await setScrollPluginOptions(page, {
			offset: () => ({ top: 100, left: 200 })
		});

		await page.locator('[href="#horizontal_tile--15"]').click();

		await wait(1000);

		const target = page.getByTestId('horizontal_tile--15');
		const container = page.getByTestId('horizontal-scroll-container');

		await expect(target).toHaveAttribute('data-swup-scroll-target', '');
		await expect(target).toBeInViewport();

		const rects = {
			target: await target.evaluate((el) => {
				return el.getBoundingClientRect();
			}),
			container: await container.evaluate((el) => {
				return el.getBoundingClientRect();
			})
		};

		const result = {
			top: rects.target.top,
			left: rects.target.left - rects.container.left
		}

		expect(Math.abs(result.top - 100)).toBeLessThanOrEqual(1);
		expect(Math.abs(result.left - 200)).toBeLessThanOrEqual(1);
	});
});
