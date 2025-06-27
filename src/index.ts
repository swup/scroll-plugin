import Plugin from '@swup/plugin';
import { type Handler, type Visit, queryAll } from 'swup';
import { compute as computeRequiredScrollActions } from 'compute-scroll-into-view';

export type OffsetCallback = (
	scrollTarget: Element,
	scrollContainer: Element,
	position: ScrollPosition
) => number | ScrollPosition;

export type Options = {
	doScrollingRightAway: boolean;
	animateScroll: {
		betweenPages: boolean;
		samePageWithHash: boolean;
		samePage: boolean;
	};
	getAnchorElement?: (hash: string) => Element | null;
	offset: number | ScrollPosition | OffsetCallback;
	scrollContainers: `[data-swup-scroll-container]`;
	shouldResetScrollPosition: (trigger: Element) => boolean;
	markScrollTarget?: boolean;
};

type ScrollPosition = {
	top: number;
	left: number;
};

type ScrollPositionsCacheEntry = {
	window: ScrollPosition;
	containers: ScrollPosition[];
};

type ScrollPositionsCache = Record<string, ScrollPositionsCacheEntry>;

declare module 'swup' {
	export interface Swup {
		scrollTo?: (
			position: number | ScrollPosition,
			animate?: boolean,
			scrollContainer?: Element
		) => void;
	}

	export interface VisitScroll {
		/** Whether scrolling is animated. Set by Scroll Plugin. */
		animate?: boolean;
		/** Whether the scroll position was reset after page load. Set by Scroll Plugin. */
		scrolledToContent?: boolean;
	}

	export interface HookDefinitions {
		'scroll:start': undefined;
		'scroll:end': undefined;
	}
}

/**
 * Scroll Plugin
 */
export default class SwupScrollPlugin extends Plugin {
	name = 'SwupScrollPlugin';

	requires = { swup: '>=4.2.0' };

	defaults: Options = {
		doScrollingRightAway: false,
		animateScroll: {
			betweenPages: true,
			samePageWithHash: true,
			samePage: true
		},
		getAnchorElement: undefined,
		offset: 0,
		scrollContainers: `[data-swup-scroll-container]`,
		shouldResetScrollPosition: () => true,
		markScrollTarget: false
	};

	options: Options;

	cachedScrollPositions: ScrollPositionsCache = {};
	previousScrollRestoration?: ScrollRestoration;
	currentCacheKey?: string;

	constructor(options: Partial<Options> = {}) {
		super();
		this.options = { ...this.defaults, ...options };
	}

	/**
	 * Run when the plugin is mounted
	 */
	mount() {
		const swup = this.swup;

		swup.hooks.create('scroll:start');
		swup.hooks.create('scroll:end');

		/* Add scrollTo method to swup instance */
		swup.scrollTo = this.scrollTo.bind(this);

		/**
		 * Disable browser scroll restoration for history visits
		 * if `swup.options.animateHistoryBrowsing` is true
		 * Store the previous setting to be able to properly restore it on unmount
		 */
		this.previousScrollRestoration = window.history.scrollRestoration;
		if (swup.options.animateHistoryBrowsing) {
			window.history.scrollRestoration = 'manual';
		}

		/**
		 * Mark the current scroll target element with a `data-swup-scroll-target` attribute
		 */
		this.updateScrollTarget = this.updateScrollTarget.bind(this);
		if (this.options.markScrollTarget) {
			window.addEventListener('popstate', this.updateScrollTarget);
			window.addEventListener('hashchange', this.updateScrollTarget);
			this.on('page:view', this.updateScrollTarget);
			this.on('link:anchor', this.updateScrollTarget);
			this.on('link:self', this.updateScrollTarget);
			this.updateScrollTarget();
		}

		// scroll to the top of the page when a visit starts, before replacing the content
		this.before('visit:start', this.onBeforeVisitStart, { priority: -1 });
		this.on('visit:start', this.onVisitStart, { priority: 1 });

		// scroll to the top or target element after replacing the content
		this.replace('content:scroll', this.handleScrollToContent);

		// scroll to the top of the same page
		this.before('link:self', this.onBeforeLinkToSelf, { priority: -1 });
		this.replace('scroll:top', this.handleScrollToTop);

		// scroll to an anchor on the same page
		this.before('link:anchor', this.onBeforeLinkToAnchor, { priority: -1 });
		this.replace('scroll:anchor', this.handleScrollToAnchor);
	}

	/**
	 * Run when the plugin is unmounted
	 */
	unmount() {
		super.unmount();

		if (this.previousScrollRestoration) {
			window.history.scrollRestoration = this.previousScrollRestoration;
		}

		window.removeEventListener('popstate', this.updateScrollTarget);
		window.removeEventListener('hashchange', this.updateScrollTarget);

		this.cachedScrollPositions = {};
		delete this.swup.scrollTo;
	}

	/**
	 * Detect if a scroll should be animated, based on context
	 */
	shouldAnimate(context: keyof Options['animateScroll']): boolean {
		if (typeof this.options.animateScroll === 'boolean') {
			return this.options.animateScroll;
		}
		return this.options.animateScroll[context];
	}

	/**
	 * Get an element based on anchor
	 */
	getAnchorElement = (hash: string = ''): Element | null => {
		// Look for a custom function provided via the plugin options
		if (typeof this.options.getAnchorElement === 'function') {
			return this.options.getAnchorElement(hash);
		}

		return this.swup.getAnchorElement(hash);
	};

	/**
	 * Get the offset for a scroll
	 */
	getOffset = (
		scrollTarget: Element,
		scrollContainer: Element,
		position: ScrollPosition
	): ScrollPosition => {
		let offset: number | ScrollPosition;

		// If options.offset is a function, apply and return it
		// Otherwise, use the actual offset value
		if (typeof this.options.offset === 'function') {
			offset = this.options.offset(scrollTarget, scrollContainer, position);
		} else {
			offset = this.options.offset;
		}

		/**
		 * Normalize offset to an object
		 * If offset is a number, use it as top and set left to 0
		 */
		if (
			typeof offset === 'object' &&
			typeof offset.top === 'number' &&
			typeof offset.left === 'number'
		) {
			return offset;
		} else {
			const top = parseInt(String(offset ?? ''), 10) || 0;
			return { top, left: 0 };
		}
	};

	/**
	 * Store scroll animation status in visit object before scrolling up
	 */
	onBeforeLinkToSelf: Handler<'link:self'> = (visit) => {
		visit.scroll.animate = this.shouldAnimate('samePage');
	};

	/**
	 * Scroll to top/left on `scroll:top` hook
	 */
	handleScrollToTop: Handler<'scroll:top'> = (visit) => {
		this.scrollTo({ top: 0, left: 0 }, visit.scroll.animate);
		return true;
	};

	/**
	 * Store scroll animation status in visit object before scrolling to anchor
	 */
	onBeforeLinkToAnchor: Handler<'link:anchor'> = (visit) => {
		visit.scroll.animate = this.shouldAnimate('samePageWithHash');
	};

	/**
	 * Scroll to anchor on `scroll:anchor` hook
	 */
	handleScrollToAnchor: Handler<'scroll:anchor'> = (visit, { hash }) => {
		return this.maybeScrollToAnchor(hash, visit.scroll.animate);
	};

	/**
	 * Attempt to scroll to an anchor
	 */
	maybeScrollToAnchor(hash?: string, animate: boolean = false): boolean {
		if (!hash) {
			return false;
		}

		const element = this.getAnchorElement(hash);
		if (!element) {
			console.warn(`Anchor target ${hash} not found`);
			return false;
		}
		if (!(element instanceof Element)) {
			console.warn(`Anchor target ${hash} is not a DOM node`);
			return false;
		}

		this.scrollElementIntoView(element, animate);

		return true;
	}

	/**
	 * Prepare scrolling before visit:start hook
	 */
	onBeforeVisitStart: Handler<'visit:start'> = (visit) => {
		visit.scroll.scrolledToContent = false;
		visit.scroll.animate = this.shouldAnimate('betweenPages');
	};

	/**
	 * Check whether to scroll in `visit:start` hook
	 */
	onVisitStart: Handler<'visit:start'> = (visit) => {
		this.cacheScrollPositions(visit.from.url);
		this.maybeResetScrollPositions(visit);

		const scrollTarget = visit.scroll.target ?? visit.to.hash;

		// Conditions for scrolling before content replace:
		// - scroll is animated (otherwise the effect is useless)
		// - no scroll target is defined (needs to wait until new content is there)
		if (visit.scroll.animate && this.options.doScrollingRightAway && !scrollTarget) {
			this.doScrollingBetweenPages(visit);
		}
	};

	/**
	 * Check whether to scroll in `content:scroll` hook
	 */
	handleScrollToContent: Handler<'content:scroll'> = (visit) => {
		if (!visit.scroll.scrolledToContent) {
			this.doScrollingBetweenPages(visit);
		}
		this.restoreScrollContainers(visit.to.url);
	};

	/**
	 * Scroll between pages
	 */
	doScrollingBetweenPages = (visit: Visit): void => {
		// Bail early on popstate if not animated: browser will handle it
		if (visit.history.popstate && !visit.animation.animate) {
			return;
		}

		// Try scrolling to a given anchor
		const scrollTarget = visit.scroll.target ?? visit.to.hash;
		if (scrollTarget && this.maybeScrollToAnchor(scrollTarget, visit.scroll.animate)) {
			return;
		}

		// Allow not resetting scroll position
		if (!visit.scroll.reset) {
			return;
		}

		// Finally, scroll to either the stored scroll position or to the very top of the page
		const scrollPositions = this.getCachedScrollPositions(visit.to.url);
		const { top = 0, left = 0 } = scrollPositions?.window || { top: 0, left: 0 };

		// Give possible JavaScript time to execute before scrolling
		requestAnimationFrame(() => this.scrollTo({ top, left }, visit.scroll.animate));

		visit.scroll.scrolledToContent = true;
	};

	/**
	 * Reset cached scroll positions. Do not reset if:
	 * - the visit is a history visit
	 * - the visit is triggered by a link and shouldResetScrollPosition(link) returns false
	 */
	maybeResetScrollPositions = (visit: Visit): void => {
		const { popstate } = visit.history;
		const { url } = visit.to;
		const { el } = visit.trigger;
		if (popstate) {
			return;
		}
		if (el && !this.options.shouldResetScrollPosition(el)) {
			return;
		}
		this.resetScrollPositions(url);
	};

	/**
	 * Store the scroll positions for the current URL
	 */
	cacheScrollPositions(url: string): void {
		const cacheKey = this.swup.resolveUrl(url);

		// retrieve the current scroll position for all containers
		const containers = queryAll(this.options.scrollContainers).map((el) => ({
			top: el.scrollTop,
			left: el.scrollLeft
		}));

		// construct the final object entry, with the window scroll positions added
		const positions = {
			window: { top: window.scrollY, left: window.scrollX },
			containers
		};

		this.cachedScrollPositions[cacheKey] = positions;
	}

	/**
	 * Resets stored scroll positions for a given URL
	 */
	resetScrollPositions(url: string): void {
		const cacheKey = this.swup.resolveUrl(url);
		delete this.cachedScrollPositions[cacheKey];
	}

	/**
	 * Get the stored scroll positions for a given URL from the cache
	 */
	getCachedScrollPositions(url: string): ScrollPositionsCacheEntry | undefined {
		const cacheKey = this.swup.resolveUrl(url);
		return this.cachedScrollPositions[cacheKey];
	}

	/**
	 * Restore the scroll positions for all matching scrollContainers
	 */
	restoreScrollContainers(url: string): void {
		// get the stored scroll positions from the cache
		const scrollPositions = this.getCachedScrollPositions(url);
		if (!scrollPositions || scrollPositions.containers.length === 0) {
			return;
		}

		// cycle through all containers on the current page and restore their scroll positions, if appropriate
		queryAll(this.options.scrollContainers).forEach((el, index) => {
			const scrollPosition = scrollPositions.containers[index];
			if (scrollPosition == null) return;
			el.scrollTop = scrollPosition.top;
			el.scrollLeft = scrollPosition.left;
		});
	}

	updateScrollTarget(): void {
		const { hash } = window.location;
		const currentTarget = document.querySelector('[data-swup-scroll-target]');
		let newTarget = this.getAnchorElement(hash);
		if (newTarget instanceof HTMLBodyElement) {
			// Special case: '#top' fragment returns <body> element
			newTarget = null;
		}
		if (currentTarget === newTarget) {
			return;
		}
		currentTarget?.removeAttribute('data-swup-scroll-target');
		newTarget?.setAttribute('data-swup-scroll-target', '');
	}

	/**
	 * Get the root scrolling element
	 */
	getRootScrollContainer() {
		return document.scrollingElement instanceof HTMLElement
			? document.scrollingElement
			: document.documentElement;
	}

	/**
	 * Scroll to a specific offset, with optional animation.
	 */
	scrollTo(position: number | ScrollPosition, animate = true, scrollContainer?: Element): void {
		const { top = 0, left = 0 } = typeof position === 'number' ? { top: position } : position;

		// Create dummy visit
		// @ts-expect-error: createVisit is currently private, need to make this semi-public somehow
		const visit = this.swup.createVisit({ to: this.swup.location.url });

		scrollContainer ??= this.getRootScrollContainer();

		const eventTarget = scrollContainer instanceof HTMLHtmlElement ? window : scrollContainer;

		/**
		 * Dispatch the scroll:end hook upon completion
		 */
		eventTarget.addEventListener(
			'scrollend',
			() => this.swup.hooks.callSync('scroll:end', visit, undefined),
			{ once: true }
		);

		/**
		 * Make the scroll cancelable upon user interaction
		 */
		eventTarget.addEventListener(
			'wheel',
			() => {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollTop,
					behavior: 'instant'
				});
			},
			{ once: true }
		);

		/**
		 * Dispatch the scroll:start hook
		 */
		this.swup.hooks.callSync('scroll:start', visit, undefined);

		scrollContainer.scrollTo({
			top,
			left,
			behavior: animate ? 'smooth' : 'instant'
		});
	}

	/**
	 * Scroll an element into view by recursively scrolling all scrollable ancestors
	 * Mimics browser's native scrollIntoView behavior for nested scrollable containers
	 */
	scrollElementIntoView(scrollTarget: Element, animate: boolean = false): void {
		const scrollActions = computeRequiredScrollActions(scrollTarget, {
			scrollMode: 'always',
			block: 'start',
			inline: 'start'
		});

		scrollActions.forEach(({ top, left, el: scrollContainer }) => {
			const { top: topOffset = 0, left: leftOffset = 0 } = this.getOffset(
				scrollTarget,
				scrollContainer,
				{ top, left }
			);
			this.scrollTo(
				{ top: top - topOffset, left: left - leftOffset },
				animate,
				scrollContainer
			);
		});
	}
}
