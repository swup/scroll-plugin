/**
 * Minimal debounce function.
 * @see https://www.joshwcomeau.com/snippets/javascript/debounce/
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
	callback: F,
	wait = 0
): (...args: Parameters<F>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<F>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
}

/**
 * Get the root scrolling element
 */
export function getRootScrollContainer(): HTMLElement {
	return document.scrollingElement instanceof HTMLElement
		? document.scrollingElement
		: document.documentElement;
}
