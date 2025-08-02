import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollPlugin from '../../../src/index.js';
import Swup, { Visit } from 'swup';

describe('Options', () => {
	let swup: Swup;
	let plugin: ScrollPlugin;
	let visit: Visit;

	beforeEach(() => {
		document.body.innerHTML = '<h1>Test</h1>';

		swup = new Swup();

		// @ts-ignore - createVisit is marked internal
		visit = swup.createVisit({ url: '/' });
		visit.to.document = new window.DOMParser().parseFromString(
			'<html><head></head><body></body></html>',
			'text/html'
		);
	});

	it('should respect animateScroll', () => {
		plugin = new ScrollPlugin({
			animateScroll: {
				betweenPages: false,
				samePage: false,
				samePageWithHash: false
			}
		});
		swup.use(plugin);

		expect(plugin.shouldAnimate('betweenPages')).toBe(false);
		expect(plugin.shouldAnimate('samePage')).toBe(false);
		expect(plugin.shouldAnimate('samePageWithHash')).toBe(false);
	});

	it('should always return an object from getOffset', () => {
		plugin = new ScrollPlugin({ offset: 300 });
		swup.use(plugin);

		const offset = plugin.getOffset(
			document.createElement('div'),
			document.createElement('div'),
			{ left: 0, top: 0 }
		);

		expect(offset).toEqual({ left: 0, top: 300 });
	});

	it('should call custom scroll function', () => {
		const scrollFunction = vi.fn();
		plugin = new ScrollPlugin({ scrollFunction });
		swup.use(plugin);

		plugin.scrollTo({ top: 300, left: 50 }, true);

		expect(scrollFunction).toHaveBeenCalledWith(
			document.documentElement,
			300,
			50,
			true,
			expect.any(Function),
			expect.any(Function)
		);
	});
});
