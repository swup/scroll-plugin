import Plugin from '@swup/plugin';
import Scrl from 'scrl';

export default class ScrollPlugin extends Plugin {
    name = "ScrollPlugin";

    constructor(options) {
        super();
        const defaultOptions = {
            doScrollingRightAway: false,
            animateScroll: {
                betweenPages: true,
                samePageWithHash: true,
                samePage: true,
            },
            scrollFriction: 0.3,
            scrollAcceleration: 0.04,
            getAnchorElement: null,
            offset: 0,
            scrollContainersSelector: `[data-swup-scroll-container]`,
            skipDeletingScrollPositions: el => {
                return false;
            }
        };

        this.options = {
            ...defaultOptions,
            ...options
        };

        // This object will hold all scroll positions
        this.scrollPositionsStore = {};
        // this URL helps with storing the current scroll positions on `willReplaceContent`
        this.previousUrl = window.location.href;
    }

    mount() {
        const swup = this.swup;

        // add empty handlers array for scroll events
        swup._handlers.scrollDone = [];
        swup._handlers.scrollStart = [];

        this.scrl = new Scrl({
            onStart: () => swup.triggerEvent('scrollStart'),
            onEnd: () => swup.triggerEvent('scrollDone'),
            onCancel: () => swup.triggerEvent('scrollDone'),
            friction: this.options.scrollFriction,
            acceleration: this.options.scrollAcceleration,
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
        }

        // disable browser scroll control on popstates when
        // animateHistoryBrowsing option is enabled in swup
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

        window.history.scrollRestoration = 'auto';
    }

    shouldAnimate(type) {
        if (typeof this.options.animateScroll === 'boolean') {
            return this.options.animateScroll;
        } else {
            return this.options.animateScroll[type];
        }
    }

    getAnchorElement = (hash = '') => {
        if (typeof this.options.getAnchorElement === 'function') {
            return this.options.getAnchorElement(hash);
        } else if (typeof this.swup.getAnchorElement === 'function') {
            // Helper only added in swup 2.0.16
            return this.swup.getAnchorElement(hash);
        } else {
            return document.querySelector(hash);
        }
    }

    getOffset = (element = null) => {
        switch (typeof this.options.offset) {
            case 'number':
                return this.options.offset;
            case 'function':
                return parseInt(this.options.offset(element), 10);
            default:
                return parseInt(this.options.offset, 10);
        }
    }

    onSamePage = () => {
        this.swup.scrollTo(0, this.shouldAnimate('samePage'));
    }

    onSamePageWithHash = event => {
        const link = event.delegateTarget;
        const element = this.getAnchorElement(link.hash);
        if (!element) {
            console.warn(`Element ${link.hash} not found`);
            return
        }
        if (!(element instanceof Element)) {
            console.warn(`Element ${link.hash} is not a DOM node`);
            return
        }
        const top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
        this.swup.scrollTo(top, this.shouldAnimate('samePageWithHash'));
    }

    onTransitionStart = popstate => {
        if (this.options.doScrollingRightAway && !this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
    }

    onContentReplaced = popstate => {
        if (!this.options.doScrollingRightAway || this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
        
        this.restoreScrollPositions()
    }

    doScrolling = popstate => {
        const swup = this.swup;

        if (!popstate || swup.options.animateHistoryBrowsing) {
            if (swup.scrollToElement != null) {
                const element = this.getAnchorElement(swup.scrollToElement);
                if (element != null) {
                    const top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
                    swup.scrollTo(top, this.shouldAnimate('betweenPages'));
                } else {
                    console.warn(`Element ${swup.scrollToElement} not found`);
                }
                swup.scrollToElement = null;
            } else {
                swup.scrollTo(0, this.shouldAnimate('betweenPages'));
            }
        }
    }

    onWillReplaceContent = () => {
        this.storeScrollPositions(this.previousUrl);
        this.previousUrl = window.location.href;
    }

    onClickLink = (e) => {
        if( this.options.skipDeletingScrollPositions(e.delegateTarget) ) {
            return;
        }
        this.deleteStoredScrollPositions(e.delegateTarget.href);
    }

    /**
     * Stores the scroll positions for the current URL
     * @param {string} url 
     */
    storeScrollPositions(url) {
      // create an object to store the scroll positions
      const storeEntry = {
        window: {top: window.scrollY, left: window.scrollX},
        elements: []
      }
      // fill up the object with scroll positions for each matching element
      const $elements = document.querySelectorAll(this.options.scrollContainersSelector);
      $elements.forEach(el => storeEntry.elements.push({
        top: el.scrollTop, 
        left: el.scrollLeft
      }));
      // put the object into the store
      this.scrollPositionsStore[url] = storeEntry;
    }

    /**
     * Deletes stored scroll positions for a given URL
     * @param {string} url 
     */
    deleteStoredScrollPositions(url) {
      delete this.scrollPositionsStore[url];
      this.scrollPositionsStore[url] = null;
    }

    /**
     * Restore the scroll positions for all matching elements
     * @returns void
     */
    restoreScrollPositions() {
      const swup = this.swup;
      // get the stored scroll positions from the cache
      const scrollPositions = this.scrollPositionsStore[window.location.href];
      if (scrollPositions == null) {
        return;
      }
      if (scrollPositions.elements == null) {
        return;
      }
      
      // cycle through all elements on the current page and restore their scroll positions, if appropriate
      const $elements = document.querySelectorAll(this.options.scrollContainersSelector);
      $elements.forEach((el, index) => {
        const scrollPosition = scrollPositions.elements[index];
        if (scrollPosition == null) return;
        el.scrollTop = scrollPosition.top;
        el.scrollLeft = scrollPosition.left;
      });
      // also restore the scroll position of the window, if animateHistoryBrowsing is true
      if( swup.options.animateHistoryBrowsing ) {
        swup.scrollTo(scrollPositions.window.top, this.shouldAnimate('betweenPages'));
      }
    }
}
