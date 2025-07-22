import type { ScrollPosition, ScrollPositions } from './index.js';

/**
 * Check if an unknown value is a non-empty object
 */
function isObject(value: unknown): boolean {
	return !!value && typeof value === 'object';
}

/**
 * Check if an unknown value has the shape of the ScrollPosition type
 */
export function isScrollPosition(value: unknown): value is ScrollPosition {
	return (
		isObject(value) &&
		typeof (value as Record<string, unknown>).top === 'number' &&
		typeof (value as Record<string, unknown>).left === 'number'
	);
}

/**
 * Check if an unknown value has the shape of the ScrollPositions type
 */
export function isScrollPositions(value: unknown): value is ScrollPositions {
	return (
		isObject(value) &&
		isScrollPosition((value as Record<string, unknown>).window) &&
		Array.isArray((value as Record<string, unknown>).containers) &&
		(value as any).containers.every(isScrollPosition)
	);
}
