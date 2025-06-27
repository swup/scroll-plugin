import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import ScrollPlugin from '../../../src/index.js';

describe('Options', () => {
	it('should respect animateScroll', () => {
		const scrollPlugin = new ScrollPlugin({
			animateScroll: {
				betweenPages: false,
				samePage: false,
				samePageWithHash: false
			}
		});
		expect(scrollPlugin.shouldAnimate('betweenPages')).toBe(false);
		expect(scrollPlugin.shouldAnimate('samePage')).toBe(false);
		expect(scrollPlugin.shouldAnimate('samePageWithHash')).toBe(false);
	});

	it('should always return an object from getOffset', () => {
		const scrollPlugin = new ScrollPlugin({
			offset: 300
		});

		const offset = scrollPlugin.getOffset(
			document.createElement('div'),
			document.createElement('div'),
			{ left: 0, top: 0 }
		);

		expect(offset).toEqual({ left: 0, top: 300 });
	});
});
