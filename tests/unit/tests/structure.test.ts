import { describe, expect, it } from 'vitest';

import ScrollPlugin from '../../../src/index.js';
import * as ScrollPluginExports from '../../../src/index.js';

describe('Structure', () => {
	it('should have the correct name', () => {
		expect(ScrollPlugin.name).toEqual('SwupScrollPlugin');
	});

	it('should only have a default export', () => {
		expect(Object.keys(ScrollPluginExports)).toEqual(['default']);
	});
});
