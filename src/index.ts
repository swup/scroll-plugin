import Plugin from '@swup/plugin';
import { Handler, Visit, getCurrentUrl, queryAll } from 'swup';
// @ts-expect-error
import Scrl from 'scrl';

export type Options = {
	doScrollingRightAway: boolean;
	animateScroll: {
		betweenPages: boolean;
		samePageWithHash: boolean;
		samePage: boolean;
	};
	scrollFriction: number;
	scrollAcceleration: number;
	getAnchorElement?: (hash: string) => Element | null;
	offset: number | ((el: Element) => number);
	scrollContainers: `[data-swup-scroll-container]`;
	shouldResetScrollPosition: (trigger: Element) => boolean;
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
		scrollTo?: (offset: number, animate?: boolean) => void;
	}

	export interface VisitScroll {
		/** Whether scrolling is animated. Set by Scroll Plugin. */
		animate?: boolean;
		/** Whether the scroll position was reset after page load. Set by Scroll Plugin. */
		scrolledToContent?: boolean;
	}

	export interface HookDefinitions {
		'scroll:start': {};
		'scroll:end': {};
	}
}

/**
 * Scroll Plugin
 */
export default class SwupScrollPlugin extends Plugin {
	name = 'SwupScrollPlugin';

	requires = { swup: '>=4.2.0' };

	scrl: any;

	defaults: Options = {
		doScrollingRightAway: false,
		animateScroll: {
			betweenPages: true,
			samePageWithHash: true,
			samePage: true
		},
		scrollFriction: 0.3,
		scrollAcceleration: 0.04,
		getAnchorElement: undefined,
		offset: 0,
		scrollContainers: `[data-swup-scroll-container]`,
		shouldResetScrollPosition: () => true
	};

	options: Options;

	cachedScrollPositions: ScrollPositionsCache = {};
	previousScrollRestoration?: ScrollRestoration;
	currentCacheKey?: string;

	constructor(options: Partial<Options> = {}) {
		super();
		this.options = { ...this.defaults, ...options };
	}

	mount() {
		const swup = this.swup;

		swup.hooks.create('scroll:start');
		swup.hooks.create('scroll:end');

		// Initialize Scrl lib for smooth animations
		this.scrl = new Scrl({
			onStart: () => swup.hooks.callSync('scroll:start'),
			onEnd: () => swup.hooks.callSync('scroll:end'),
			onCancel: () => swup.hooks.callSync('scroll:end'),
			friction: this.options.scrollFriction,
			acceleration: this.options.scrollAcceleration
		});

		// Add scrollTo method to swup and animate based on current animateScroll option
		swup.scrollTo = (offset, animate = true) => {
			if (animate) {
				this.scrl.scrollTo(offset);
			} else {
				swup.hooks.callSync('scroll:start');
				window.scrollTo(0, offset);
				swup.hooks.callSync('scroll:end');
			}
		};

		/**
		 * Disable browser scroll restoration for history visits
		 * if `swup.options.animateHistoryBrowsing` is true
		 * Store the previous setting to be able to properly restore it on unmount
		 */
		this.previousScrollRestoration = window.history.scrollRestoration;
		if (swup.options.animateHistoryBrowsing) {
			window.history.scrollRestoration = 'manual';
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
	 * Runs when the plugin is unmounted
	 */
	unmount() {
		super.unmount();

		if (this.previousScrollRestoration) {
			window.history.scrollRestoration = this.previousScrollRestoration;
		}

		this.cachedScrollPositions = {};
		delete this.swup.scrollTo;
		delete this.scrl;
	}

	/**
	 * Detects if a scroll should be animated, based on context
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
	getOffset = (el?: Element): number => {
		if (!el) return 0;
		// If options.offset is a function, apply and return it
		if (typeof this.options.offset === 'function') {
			return parseInt(String(this.options.offset(el)), 10);
		}
		// Otherwise, return the sanitized offset
		return parseInt(String(this.options.offset), 10);
	};

	/**
	 * Store scroll animation status in visit object before scrolling up
	 */
	onBeforeLinkToSelf: Handler<'link:self'> = (visit) => {
		visit.scroll.animate = this.shouldAnimate('samePage');
	};

	/**
	 * Scroll to top on `scroll:top` hook
	 */
	handleScrollToTop: Handler<'scroll:top'> = (visit) => {
		this.swup.scrollTo?.(0, visit.scroll.animate);
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
	 * Attempts to scroll to an anchor
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

		const { top: elementTop } = element.getBoundingClientRect();
		const top = elementTop + window.scrollY - this.getOffset(element);
		this.swup.scrollTo?.(top, animate);

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
		this.maybeResetScrollPositions(visit);
		this.cacheScrollPositions(visit.from.url);

		const scrollTarget = visit.scroll.target ?? visit.to.hash;

		// Conditions for scrolling before content replace:
		// - scroll is animated (otherwise the effect is useless)
		// - no scroll target is defined (needs to wait until new content is there)
		if (
			visit.scroll.animate &&
			this.options.doScrollingRightAway &&
			!scrollTarget
		) {
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
	 * Scrolls the window
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
		const top = scrollPositions?.window?.top || 0;

		// Give possible JavaScript time to execute before scrolling
		requestAnimationFrame(() => this.swup.scrollTo?.(top, visit.scroll.animate));

		visit.scroll.scrolledToContent = true;
	};

	/**
	 * Resets cached scroll positions for visits with a trigger element,
	 * where shouldResetScrollPosition returns true for that trigger
	 */
	maybeResetScrollPositions = (visit: Visit): void => {
		const { url } = visit.to;
		const { el } = visit.trigger;
		if (el && !this.options.shouldResetScrollPosition(el)) {
			return;
		}
		this.resetScrollPositions(url);
	};

	/**
	 * Stores the scroll positions for the current URL
	 */
	cacheScrollPositions(url: string): void {
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

		this.cachedScrollPositions[url] = positions;
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

}
