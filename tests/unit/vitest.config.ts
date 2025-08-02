/**
 * Vitest config file
 * @see https://vitest.dev/config/
 */

import path from 'node:path';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(__filename);

export default defineConfig({
	test: {
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				console: true,
				resources: 'usable'
			}
		},
		include: ['tests/unit/tests/*.test.ts'],
		setupFiles: [path.resolve(__dirname, './vitest.setup.ts')]
	}
});
