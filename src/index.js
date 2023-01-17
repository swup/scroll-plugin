import Plugin from '@swup/plugin';
import Scrl from 'scrl';
import { getCurrentUrl, Location, queryAll } from 'swup';

/**
 * Class representing a Scroll Plugin.
 * @extends Plugin
 */
export default class ScrollPlugin extends Plugin {
	name = 'ScrollPlugin';

	/**
	 * Constructor
	 * @param {?object} options the plugin options
	 */
	constructor(options) {
		super();
		const defaultOptions = {
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
			shouldResetScrollPosition: (htmlAnchorElement) => true
		};

		this.options = {
			...defaultOptions,
			...options
		};
	}

	/**
	 * Runs if the plugin is mounted
	 */
	mount() {
		const swup = this.swup;

		// add empty handlers array for scroll events
		swup._handlers.scrollDone = [];
		swup._handlers.scrollStart = [];

		// Initialize Scrl for smooth animations
		this.scrl = new Scrl({
			onStart: () => swup.triggerEvent('scrollStart'),
			onEnd: () => swup.triggerEvent('scrollDone'),
			onCancel: () => swup.triggerEvent('scrollDone'),
			friction: this.options.scrollFriction,
			acceleration: this.options.scrollAcceleration
		});

		// set scrollTo method of swup and animate based on current animateScroll option
		swup.scrollTo = (offset, animate = true) => {
			if (animate) {
				this.scrl.scrollTo(offset);
			} else {
				swup.triggerEvent('scrollStart');
				window.scrollTo(0, offset);
				swup.triggerEvent('scrollDone');
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

		// scroll to the top of the page
		swup.on('samePage', this.onSamePage);

		// scroll to referenced element on the same page
		swup.on('samePageWithHash', this.onSamePageWithHash);

		// scroll to the referenced element
		swup.on('transitionStart', this.onTransitionStart);

		// scroll to the referenced element when it's in the page (after render)
		swup.on('contentReplaced', this.onContentReplaced);

		swup.on('willReplaceContent', this.onWillReplaceContent);
		swup.on('clickLink', this.onClickLink);
	}

	/**
	 * Runs when the plugin is unmounted
	 */
	unmount() {
		const swup = this.swup;
		swup.scrollTo = null;

		delete this.scrl;
		this.scrl = null;

		swup.off('samePage', this.onSamePage);
		swup.off('samePageWithHash', this.onSamePageWithHash);
		swup.off('transitionStart', this.onTransitionStart);
		swup.off('contentReplaced', this.onContentReplaced);
		swup.off('willReplaceContent', this.onWillReplaceContent);
		swup.off('clickLink', this.onClickLink);

		swup._handlers.scrollDone = null;
		swup._handlers.scrollStart = null;

		window.history.scrollRestoration = this.previousScrollRestoration;
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
		}
		// Look for a the built-in function in swup, added in swup 2.0.16
		if (typeof this.swup.getAnchorElement === 'function') {
			return this.swup.getAnchorElement(hash);
		}
		// Finally, return a native browser query
		return document.querySelector(hash);
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
	 * Handles `samePage`
	 */
	onSamePage = () => {
		this.swup.scrollTo(0, this.shouldAnimate('samePage'));
	};

	/**
	 * Handles `onSamePageWithHash`
	 * @param {PointerEvent} event
	 */
	onSamePageWithHash = (event) => {
		const link = event.delegateTarget;
		this.maybeScrollToAnchor(link.hash, 'samePageWithHash');
	};

	/**
	 * Attempts to scroll to an anchor
	 * @param {string} hash
	 * @param {string} context
	 * @returns {boolean}
	 */
	maybeScrollToAnchor(hash, context) {
		// Bail early if the hash is null
		if (hash == null) {
			return false;
		}
		const element = this.getAnchorElement(hash);
		if (!element) {
			console.warn(`Element ${hash} not found`);
			return false;
		}
		if (!(element instanceof Element)) {
			console.warn(`Element ${hash} is not a DOM node`);
			return false;
		}
		const top =
			element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
		this.swup.scrollTo(top, this.shouldAnimate(context));
		return true;
	}

	/**
	 * Handles `transitionStart`
	 * @param {PopStateEvent} popstate
	 */
	onTransitionStart = (popstate) => {
		if (this.options.doScrollingRightAway && !this.swup.scrollToElement) {
			this.doScrollingBetweenPages(popstate);
		}
	};

	/**
	 * Handles `contentReplaced`
	 * @param {PopStateEvent} popstate
	 */
	onContentReplaced = (popstate) => {
		if (!this.options.doScrollingRightAway || this.swup.scrollToElement) {
			this.doScrollingBetweenPages(popstate);
		}

		this.restoreScrollContainers(popstate);
	};

	/**
	 * Scrolls the window, based on context
	 * @param {(PopStateEvent|boolean)} popstate
	 * @returns {void}
	 */
	doScrollingBetweenPages = (popstate) => {
		const swup = this.swup;

		// Bail early on popstate and inactive `animateHistoryBrowsing`
		if (popstate && !swup.options.animateHistoryBrowsing) {
			return;
		}

		// Try scrolling to a given anchor
		if (this.maybeScrollToAnchor(swup.scrollToElement, 'betweenPages')) {
			swup.scrollToElement = null;
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
	onWillReplaceContent = () => {
		this.storeScrollPositions(this.currentCacheKey);
		this.currentCacheKey = this.getCurrentCacheKey();
	};

	/**
	 * Handles `clickLink`
	 * @param {PointerEvent}
	 * @returns {void}
	 */
	onClickLink = (event) => {
		this.maybeResetScrollPositions(event.delegateTarget);
	};

	/**
	 * Deletes the scroll positions for the URL a link is pointing to,
	 * if shouldResetScrollPosition evaluates to true
	 * @param {HTMLAnchorElement} htmlAnchorElement
	 * @returns {void}
	 */
	maybeResetScrollPositions(htmlAnchorElement) {
		if (!this.options.shouldResetScrollPosition(htmlAnchorElement)) {
			return;
		}
		const { url } = Location.fromElement(htmlAnchorElement);
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
		delete this.scrollPositionsStore[url];
		this.scrollPositionsStore[url] = null;
	}

	/**
	 * Get the stored scroll positions for a given URL from the cache
	 * @returns {(object|null)}
	 */
	getStoredScrollPositions(url) {
		return this.scrollPositionsStore[url];
	}

	/**
	 * Restore the scroll positions for all matching scrollContainers
	 * @returns void
	 */
	restoreScrollContainers(popstate) {
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
	 * uses `getCurrentUrl` and applies `swup.resolveUrl` if present
	 *
	 * `swup.resolveUrl` will become available in Swup 3
	 *
	 * @returns {string}
	 */
	getCurrentCacheKey() {
		const path = getCurrentUrl();
		if (typeof this.swup.resolveUrl === 'function') {
			return this.swup.resolveUrl(path);
		}
		return path;
	}
}
