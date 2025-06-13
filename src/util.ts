/**
 * Get the root scrolling element
 */
export function getRootScrollContainer(): HTMLElement {
	return document.scrollingElement instanceof HTMLElement
		? document.scrollingElement
		: document.documentElement;
}
