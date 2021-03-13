import Plugin from '@swup/plugin';
import Scrl from 'scrl';

export default class ScrollPlugin extends Plugin {
    name = "ScrollPlugin";

    constructor(options) {
        super();
        const defaultOptions = {
            doScrollingRightAway: false,
            animateScroll: true,
            scrollFriction: 0.3,
            scrollAcceleration: 0.04,
            offset: 0,
        };

        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    mount() {
        const swup = this.swup;

        // add empty handlers array for submitForm event
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
        swup.scrollTo = offset => {
            if (this.options.animateScroll) {
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
    }

    unmount() {
        this.swup.scrollTo = null;

        delete this.scrl;
        this.scrl = null;

        this.swup.off('samePage', this.onSamePage);
        this.swup.off('samePageWithHash', this.onSamePageWithHash);
        this.swup.off('transitionStart', this.onTransitionStart);
        this.swup.off('contentReplaced', this.onContentReplaced);

        this.swup._handlers.scrollDone = null;
        this.swup._handlers.scrollStart = null;

        window.history.scrollRestoration = 'auto';
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
        this.swup.scrollTo(0);
    }

    onSamePageWithHash = event => {
        const link = event.delegateTarget;
        const element = document.querySelector(link.hash);
        const top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
        this.swup.scrollTo(top);
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
    }

    doScrolling = popstate => {
        const swup = this.swup;

        if (!popstate || swup.options.animateHistoryBrowsing) {
            if (swup.scrollToElement != null) {
                const element = document.querySelector(swup.scrollToElement);
                if (element != null) {
                    let top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
                    swup.scrollTo(top);
                } else {
                    console.warn(`Element ${swup.scrollToElement} not found`);
                }
                swup.scrollToElement = null;
            } else {
                swup.scrollTo(0);
            }
        }
    };
}
