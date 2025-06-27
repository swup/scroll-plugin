import { describe, expect, it } from 'vitest';

import ScrollPlugin from '../../../src/index.js';

describe('Option `animateScroll`', () => {
	it('should respect animateScroll options', () => {
		const scrollPlugin = new ScrollPlugin({
			animateScroll: {
				betweenPages: false,
				samePage: false,
				samePageWithHash: false
			}
		})
		expect(scrollPlugin.shouldAnimate('betweenPages')).toBe(false);
		expect(scrollPlugin.shouldAnimate('samePage')).toBe(false);
		expect(scrollPlugin.shouldAnimate('samePageWithHash')).toBe(false);
	});
});
