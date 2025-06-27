import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { Options } from '../../../src/index.ts';
import SwupScrollPlugin from '../../../src/index.ts';

type ScrollPosition = {
	x: number;
	y: number;
};

export function scrollTo(page: Page, position: Partial<ScrollPosition>, testId?: string) {
	return page.evaluate(
		(args) => {
			if (args.testId) {
				window.document.querySelector(`[data-testid="${args.testId}"]`)?.scrollTo({
					left: args.position.x,
					top: args.position.y,
					behavior: 'instant'
				});
				return;
			}
			window.scrollTo(args.position.x, args.position.y);
		},
		{
			position: {
				...{ x: 0, y: 0 },
				...position
			},
			testId
		}
	);
}

export function scrollToEnd(page: Page, testId?: string) {
	return page.evaluate(
		(args) => {
			if (args.testId) {
				const el = document.querySelector(`[data-testid="${args.testId}"]`)!;
				el.scrollTo({
					left: el.scrollWidth,
					top: el.scrollHeight
				});
				return;
			}
			window.scrollTo({
				left: document.body.scrollWidth,
				top: document.body.scrollHeight
			});
		},
		{ testId }
	);
}

export function wait(timeout = 0): Promise<void> {
	return new Promise((resolve) => setTimeout(() => resolve(undefined), timeout));
}

export async function expectScrollPosition(page: Page, expected: ScrollPosition, testId?: string) {
	const scrollY = await page.evaluate((testId): ScrollPosition => {
		if (!testId)
			return {
				x: window.scrollY,
				y: window.scrollX
			};
		const el = window.document.querySelector(`[data-testid="${testId}"]`);
		if (!el) return { x: -1, y: -1 };
		return {
			x: el.scrollLeft,
			y: el.scrollTop
		};
	}, testId);
	expect(scrollY).toEqual(expected);
}

function roundTwoDecimals(value: number) {
	return Math.round(value * 100) / 100;
}

export async function setScrollPluginOption(page: Page, option: keyof Options, value: any) {
	return page.evaluate(
		({ option, value }) => {
			(window as any).scrollPlugin.options[option] = value;
		},
		{ option, value }
	);
}

/**
 * Dynamically set scroll plugin options in the browser.
 * Serializes and de-serializes function callbacks
 */
export async function setScrollPluginOptions(page: Page, options: Partial<Options>) {
	// Serialize: convert any functions into stringified versions with a "fn:" prefix
	const serializedOptions = Object.fromEntries(
		Object.entries(options).map(([key, value]) => {
			if (typeof value === 'function') {
				return [key, `__fn__:${value.toString()}`];
			}
			return [key, value];
		})
	);

	// Pass into browser context and reconstruct any functions from strings
	return page.evaluate((options) => {
		for (const key in options) {
			const value = options[key];
			if (typeof value === 'string' && value.startsWith('__fn__:')) {
				try {
					const functionBody = value.slice('__fn__:'.length);
					options[key] = new Function(`return (${functionBody}).apply(this, arguments);`);
					console.log(options[key]);
				} catch (e) {
					console.error(`Failed to unserialize function for key "${key}":`, e);
				}
			}
		}

		(window as any).scrollPlugin.options = {
			...(window as any).scrollPlugin.options,
			...options
		};
	}, serializedOptions);
}
