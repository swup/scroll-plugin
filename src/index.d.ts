/**
 * Class representing the Swup Scroll Plugin.
 * @extends Plugin
 */
export default class ScrollPlugin {
    /**
     * @typedef {object} animateScrollObject
     * @property {boolean} [animateScrollObject.betweenPages]
     * @property {boolean} [animateScrollObject.samePageWithHash]
     * @property {boolean} [animateScrollObject.samePage]
     */
    /**
     * Constructor
     * @param {object} options
     * @param {boolean} [options.doScrollingRightAway]
     * @param {boolean|animateScrollObject} [options.animateScroll]
     * @param {number} [options.scrollFriction]
     * @param {number} [options.scrollAcceleration]
     * @param {?function} [options.getAnchorElement]
     * @param {number} [options.offset]
     * @param {string} [options.scrollContainers]
     * @param {function} [options.shouldResetScrollPosition]
     */
    constructor(options?: {
        doScrollingRightAway?: boolean;
        animateScroll?: boolean | {
            betweenPages?: boolean;
            samePageWithHash?: boolean;
            samePage?: boolean;
        };
        scrollFriction?: number;
        scrollAcceleration?: number;
        getAnchorElement?: Function | null;
        offset?: number;
        scrollContainers?: string;
        shouldResetScrollPosition?: Function;
    });
    name: string;
    options: {};
    scrollPositionsStore: {};
    previousUrl: string;
    /**
     * Runs if the plugin is mounted
     */
    mount(): void;
    scrl: any;
    previousScrollRestoration: string;
    /**
     * Runs when the plugin is unmounted
     */
    unmount(): void;
    /**
     * Detects if a scroll should be animated, based on context
     * @private
     * @param {string} context
     * @returns {boolean}
     */
    private shouldAnimate;
    /**
     * Get an element based on anchor
     * @param {string} selector
     * @returns {*}
     */
    getAnchorElement: (selector?: string) => any;
    /**
     * Get the offset for a scroll
     * @param {?HTMLElement} element
     * @returns {number}
     */
    getOffset: (element?: HTMLElement | null) => number;
    /**
     * Handles `samePage`
     * @private
     */
    private onSamePage;
    /**
     * Handles `onSamePageWithHash`
     * @private
     * @param {PointerEvent} event
     */
    private onSamePageWithHash;
    /**
     * Attempts to scroll to an anchor
     * @param {string} selector A selector string
     * @param {string} context
     * @returns {boolean}
     */
    maybeScrollToAnchor(selector: string, context: string): boolean;
    /**
     * Handles `transitionStart`
     * @private
     * @param {PopStateEvent} popstate
     */
    private onTransitionStart;
    /**
     * Handles `contentReplaced`
     * @private
     * @param {PopStateEvent} popstate
     */
    private onContentReplaced;
    /**
     * Scrolls the window, based on context
     * @private
     * @param {(PopStateEvent|boolean)} popstate
     * @returns {void}
     */
    private doScrollingBetweenPages;
    /**
     * Stores the current scroll positions for the URL we just came from
     * @private
     */
    private onWillReplaceContent;
    /**
     * Handles `clickLink`
     * @private
     * @param {PointerEvent} event
     * @returns {void}
     */
    private onClickLink;
    /**
     * Deletes the scroll positions for the URL a link is pointing to,
     * if shouldResetScrollPosition evaluates to true
     * @private
     * @param {HTMLAnchorElement} htmlAnchorElement
     * @returns {void}
     */
    private maybeResetScrollPositions;
    /**
     * Stores the scroll positions for the current URL
     * @param {string} url The URL you want to store the scroll positions for
     * @returns {void}
     */
    storeScrollPositions(url: string): void;
    /**
     * Resets stored scroll positions for a given URL
     * @param {string} url The URL you want to reset the scroll positions for
     */
    resetScrollPositions(url: string): void;
    /**
     * Get the stored scroll positions for a given URL from the cache
     * @param {string} url The URL you want to get the scroll positions for
     * @returns {?object}
     */
    getStoredScrollPositions(url: string): object | null;
    /**
     * Restore the scroll positions for all matching scrollContainers, for the current URL
     * @param {(PopStateEvent|boolean)} popstate
     * @returns void
     */
    restoreScrollContainers(popstate: (PopStateEvent | boolean)): void;
}
