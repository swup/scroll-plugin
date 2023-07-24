import Plugin from '@swup/plugin';
import { getCurrentUrl, queryAll } from 'swup';
import Scrl from 'scrl';

/**
 * Scroll Plugin
 * @extends Plugin
 */
export default class SwupScrollPlugin extends Plugin {
	name = 'SwupScrollPlugin';

	requires = { swup: '>=4' };

	defaults = {
		doScrollingRightAway: false,
		animateScroll: {
			betweenPages: true,
			samePageWithHash: true,
			samePage: true
		},
		scrollFriction: 0.3,
		scrollAcceleration: 0.04,
		getAnchorElement: null,
		offset: 0,
		scrollContainers: `[data-swup-scroll-container]`,
		shouldResetScrollPosition: (link) => true
	};

	constructor(options = {}) {
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

		// This object will hold all scroll positions
		this.scrollPositionsStore = {};
		// this URL helps with storing the current scroll positions on `willReplaceContent`
		this.currentCacheKey = this.getCurrentCacheKey();

		// disable browser scroll control on popstates when
		// animateHistoryBrowsing option is enabled in swup.
		// Cache the previous setting to be able to properly restore it on unmount
		this.previousScrollRestoration = window.history.scrollRestoration;
		if (swup.options.animateHistoryBrowsing) {
			window.history.scrollRestoration = 'manual';
		}

		// reset scroll positions when a visit starts
		this.on('visit:start', this.maybeResetScrollPositions);

		// scroll to the top of the page when a visit starts, before replacing the content
		this.on('visit:start', this.onVisitStart);

		// store the current scroll positions before replacing the content
		this.before('content:replace', this.onBeforeReplaceContent);

		// scroll to the top or target element after replacing the content
		this.replace('content:scroll', this.onScrollToContent);

		// scroll to the top of the page
		this.replace('scroll:top', this.handleScrollToTop);

		// scroll to an anchor on the same page
		this.replace('scroll:anchor', this.handleScrollToAnchor);
	}

	/**
	 * Runs when the plugin is unmounted
	 */
	unmount() {
		super.unmount();

		window.history.scrollRestoration = this.previousScrollRestoration;
		delete this.swup.scrollTo;
		delete this.scrl;
	}

	/**
	 * Detects if a scroll should be animated, based on context
	 * @param {string} context
	 * @returns {boolean}
	 */
	shouldAnimate(context) {
		if (typeof this.options.animateScroll === 'boolean') {
			return this.options.animateScroll;
		}
		return this.options.animateScroll[context];
	}

	/**
	 * Get an element based on anchor
	 * @param {string} hash
	 * @returns {mixed}
	 */
	getAnchorElement = (hash = '') => {
		// Look for a custom function provided via the plugin options
		if (typeof this.options.getAnchorElement === 'function') {
			return this.options.getAnchorElement(hash);
		} else {
			return this.swup.getAnchorElement(hash);
		}
	};

	/**
	 * Get the offset for a scroll
	 * @param {(HtmlELement|null)} element
	 * @returns {number}
	 */
	getOffset = (element = null) => {
		// If options.offset is a function, apply and return it
		if (typeof this.options.offset === 'function') {
			return parseInt(this.options.offset(element), 10);
		}
		// Otherwise, return the sanitized offset
		return parseInt(this.options.offset, 10);
	};

	/**
	 * Scroll to top on `scroll:top` hook
	 */
	handleScrollToTop = () => {
		this.swup.scrollTo(0, this.shouldAnimate('samePage'));
		return true;
	};

	/**
	 * Scroll to anchor on `scroll:anchor` hook
	 */
	handleScrollToAnchor = (visit, { hash }) => {
		return this.maybeScrollToAnchor(hash, this.shouldAnimate('samePageWithHash'));
	};

	/**
	 * Attempts to scroll to an anchor
	 * @param {string} hash
	 * @param {boolean} animate
	 * @returns {boolean}
	 */
	maybeScrollToAnchor(hash, animate = false) {
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
		this.swup.scrollTo(top, animate);

		return true;
	}

	/**
	 * Check whether to scroll in `visit:start` hook
	 */
	onVisitStart = (visit) => {
		if (this.options.doScrollingRightAway && !visit.scroll.target) {
			visit.scroll.scrolledToContent = true;
			this.doScrollingBetweenPages(visit);
		}
	};

	/**
	 * Check whether to scroll in `content:scroll` hook
	 */
	onScrollToContent = (visit) => {
		if (!visit.scroll.scrolledToContent) {
			this.doScrollingBetweenPages(visit);
		}
		this.restoreScrollContainers(visit);
	};

	/**
	 * Scrolls the window
	 * @returns {void}
	 */
	doScrollingBetweenPages = (visit) => {
		// Bail early on popstate if not animated: browser will handle it
		if (visit.history.popstate && !visit.transition.animate) {
			return;
		}

		// Try scrolling to a given anchor
		if (this.maybeScrollToAnchor(visit.scroll.target, this.shouldAnimate('betweenPages'))) {
			return;
		}

		// Allow not resetting scroll position
		if (!visit.scroll.reset) {
			return;
		}

		// Finally, scroll to either the stored scroll position or to the very top of the page
		const scrollPositions = this.getStoredScrollPositions(this.getCurrentCacheKey()) || {};
		const top = scrollPositions.window?.top || 0;

		// Give possible JavaScript time to execute before scrolling
		requestAnimationFrame(() => this.swup.scrollTo(top, this.shouldAnimate('betweenPages')));
	};

	/**
	 * Stores the current scroll positions for the URL we just came from
	 */
	onBeforeReplaceContent = () => {
		this.storeScrollPositions(this.currentCacheKey);
		this.currentCacheKey = this.getCurrentCacheKey();
	};

	/**
	 * Deletes the scroll positions for the URL a link is pointing to,
	 * if shouldResetScrollPosition evaluates to true
	 * @returns {void}
	 */
	maybeResetScrollPositions(visit) {
		const { url } = visit.to;
		const { el } = visit.trigger;
		const shouldReset = !el || this.options.shouldResetScrollPosition(el);
		if (shouldReset) {
			this.resetScrollPositions(url);
		}
	}

	/**
	 * Stores the scroll positions for the current URL
	 * @param {string} url
	 * @returns {void}
	 */
	storeScrollPositions(url) {
		// retrieve the current scroll position for all containers
		const containers = queryAll(this.options.scrollContainers).map((el) => ({
			top: el.scrollTop,
			left: el.scrollLeft
		}));

		// construct the final object entry, with the window scroll positions added
		this.scrollPositionsStore[url] = {
			window: { top: window.scrollY, left: window.scrollX },
			containers
		};
	}

	/**
	 * Resets stored scroll positions for a given URL
	 * @param {string} url
	 */
	resetScrollPositions(url) {
		const cacheKey = this.swup.resolveUrl(url);
		delete this.scrollPositionsStore[cacheKey];
		this.scrollPositionsStore[cacheKey] = null;
	}

	/**
	 * Get the stored scroll positions for a given URL from the cache
	 * @returns {(object|undefined)}
	 */
	getStoredScrollPositions(url) {
		const cacheKey = this.swup.resolveUrl(url);
		return this.scrollPositionsStore[cacheKey];
	}

	/**
	 * Restore the scroll positions for all matching scrollContainers
	 * @returns void
	 */
	restoreScrollContainers() {
		// get the stored scroll positions from the cache
		const scrollPositions = this.getStoredScrollPositions(this.getCurrentCacheKey()) || {};
		if (scrollPositions.containers == null) {
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

	/**
	 * Get the current cache key for the scroll positions.
	 * @returns {string}
	 */
	getCurrentCacheKey() {
		return this.swup.resolveUrl(getCurrentUrl());
	}
}
