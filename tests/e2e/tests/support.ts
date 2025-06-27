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

// Serialize an object that contains functions
function serialize(obj: unknown) {
	return JSON.stringify(obj, (key, value) => {
		if (typeof value === 'function') {
			return `__func__:${value.toString()}`;
		}
		return value;
	});
}

// Unserialize an object that contains functions
function unserialize(json: string) {
	return JSON.parse(json, (key, value) => {
		if (typeof value === 'string' && value.startsWith('__func__:')) {
			const functionCode = value.slice('__func__:'.length);
			return new Function(`return (${functionCode})`)(); // creates a new function
		}
		return value;
	});
}

/**
 * Dynamically set scroll plugin options in the browser.
 * Serializes and de-serializes function callbacks
 */
export async function setScrollPluginOptions(page: Page, options: Partial<Options>) {
	// Pass into browser context and reconstruct any functions from strings
	return page.evaluate(
		({ options, unserializeFn }) => {
			const unserialize = new Function(`return (${unserializeFn})`)();
			(window as any).scrollPlugin.options = {
				...(window as any).scrollPlugin.options,
				...unserialize(options)
			};
		},
		{ options: serialize(options), unserializeFn: unserialize.toString() }
	);
}
