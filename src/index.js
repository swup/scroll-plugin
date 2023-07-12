import Plugin from '@swup/plugin';
import { getCurrentUrl, Location, queryAll } from 'swup';
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

	/**
	 * Constructor
	 * @param {object|undefined} options the plugin options
	 */
	constructor(options = {}) {
		super();
		this.options = { ...this.defaults, ...options };
	}

	/**
	 * Runs when the plugin is mounted
	 */
	mount() {
		const swup = this.swup;

		swup.hooks.create('scroll:start');
		swup.hooks.create('scroll:end');

		// Initialize Scrl lib for smooth animations
		this.scrl = new Scrl({
			onStart: () => swup.hooks.triggerSync('scroll:start'),
			onEnd: () => swup.hooks.triggerSync('scroll:end'),
			onCancel: () => swup.hooks.triggerSync('scroll:end'),
			friction: this.options.scrollFriction,
			acceleration: this.options.scrollAcceleration
		});

		// Add scrollTo method to swup and animate based on current animateScroll option
		swup.scrollTo = (offset, animate = true) => {
			if (animate) {
				this.scrl.scrollTo(offset);
			} else {
				swup.hooks.triggerSync('scroll:start');
				window.scrollTo(0, offset);
				swup.hooks.triggerSync('scroll:end');
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

		// reset scroll positions
		swup.hooks.on('link:click', this.onLinkClick);

		// scroll to the top of the page
		swup.hooks.replace('link:self', this.onLinkToSelf);

		// scroll to referenced element on the same page
		swup.hooks.replace('link:anchor', this.onLinkToAnchor);

		// scroll to the top of the page when transition starts, before replacing the content
		swup.hooks.on('visit:start', this.onVisitStart);

		// store the current scroll positions before replacing the content
		swup.hooks.before('content:replace', this.onBeforeReplaceContent);

		// scroll to the top or target element after replacing the content
		swup.hooks.replace('content:scroll', this.onScrollToContent);
	}

	/**
	 * Runs when the plugin is unmounted
	 */
	unmount() {
		const swup = this.swup;
		delete swup.scrollTo;
		delete this.scrl;

		window.history.scrollRestoration = this.previousScrollRestoration;

		swup.hooks.off('link:click', this.onLinkClick);
		swup.hooks.off('link:self', this.onLinkToSelf);
		swup.hooks.off('link:anchor', this.onLinkToAnchor);
		swup.hooks.off('visit:start', this.onVisitStart);
		swup.hooks.off('content:scroll', this.onScrollToContent);
		swup.hooks.off('content:replace', this.onBeforeReplaceContent);
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
	 * Scroll to top on `link:self` hook
	 */
	onLinkToSelf = () => {
		this.swup.scrollTo(0, this.shouldAnimate('link:self'));
	};

	/**
	 * Scroll to fragment on `link:anchor` hook
	 */
	onLinkToAnchor = (context, { hash }) => {
		this.maybeScrollToAnchor(hash, 'link:anchor');
	};

	/**
	 * Attempts to scroll to an anchor
	 * @param {string} hash
	 * @param {string} context
	 * @returns {boolean}
	 */
	maybeScrollToAnchor(hash, context) {
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
		this.swup.scrollTo(top, this.shouldAnimate(context));

		return true;
	}

	/**
	 * Check whether to scroll in `visit:start` hook
	 */
	onVisitStart = (context) => {
		if (this.options.doScrollingRightAway && !context.scroll.target) {
			context.scroll.scrolledToContent = true;
			this.doScrollingBetweenPages(context);
		}
	};

	/**
	 * Check whether to scroll in `content:scroll` hook
	 */
	onScrollToContent = (context) => {
		if (!context.scroll.scrolledToContent) {
			this.doScrollingBetweenPages(context);
		}
		this.restoreScrollContainers(context);
	};

	/**
	 * Scrolls the window, based on context
	 * @returns {void}
	 */
	doScrollingBetweenPages = (context) => {
		const swup = this.swup;

		// Bail early on popstate if not animated: browser will handle it
		if (context.history.popstate && !context.transition.animate) {
			return;
		}

		// Try scrolling to a given anchor
		if (this.maybeScrollToAnchor(context.scroll.target, 'betweenPages')) {
			return;
		}

		// Allow not resetting scroll position
		if (!context.scroll.reset) {
			return;
		}

		// Finally, scroll to either the stored scroll position or to the very top of the page
		const scrollPositions = this.getStoredScrollPositions(this.getCurrentCacheKey()) || {};
		const top = (scrollPositions.window && scrollPositions.window.top) || 0;

		// Give possible JavaScript time to execute before scrolling
		requestAnimationFrame(() => swup.scrollTo(top, this.shouldAnimate('betweenPages')));
	};

	/**
	 * Stores the current scroll positions for the URL we just came from
	 */
	onBeforeReplaceContent = () => {
		this.storeScrollPositions(this.currentCacheKey);
		this.currentCacheKey = this.getCurrentCacheKey();
	};

	/**
	 * Handles `clickLink`
	 * @returns {void}
	 */
	onLinkClick = (context, { el }) => {
		this.maybeResetScrollPositions(context.trigger.el);
	};

	/**
	 * Deletes the scroll positions for the URL a link is pointing to,
	 * if shouldResetScrollPosition evaluates to true
	 * @param {HTMLElement} el
	 * @returns {void}
	 */
	maybeResetScrollPositions(el) {
		if (!this.options.shouldResetScrollPosition(el)) {
			return;
		}
		const { url } = Location.fromElement(el);
		this.resetScrollPositions(url);
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
