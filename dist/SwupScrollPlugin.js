(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SwupScrollPlugin"] = factory();
	else
		root["SwupScrollPlugin"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var query = exports.query = function query(selector) {
	var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	if (typeof selector !== 'string') {
		return selector;
	}

	return context.querySelector(selector);
};

var queryAll = exports.queryAll = function queryAll(selector) {
	var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	if (typeof selector !== 'string') {
		return selector;
	}

	return Array.prototype.slice.call(context.querySelectorAll(selector));
};

var escapeCssIdentifier = exports.escapeCssIdentifier = function escapeCssIdentifier(ident) {
	if (window.CSS && window.CSS.escape) {
		return CSS.escape(ident);
	} else {
		return ident;
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Link = function () {
	function Link(elementOrUrl) {
		_classCallCheck(this, Link);

		if (elementOrUrl instanceof Element || elementOrUrl instanceof SVGElement) {
			this.link = elementOrUrl;
		} else {
			this.link = document.createElement('a');
			this.link.href = elementOrUrl;
		}
	}

	_createClass(Link, [{
		key: 'getPath',
		value: function getPath() {
			var path = this.link.pathname;
			if (path[0] !== '/') {
				path = '/' + path;
			}
			return path;
		}
	}, {
		key: 'getAddress',
		value: function getAddress() {
			var path = this.link.pathname + this.link.search;

			if (this.link.getAttribute('xlink:href')) {
				path = this.link.getAttribute('xlink:href');
			}

			if (path[0] !== '/') {
				path = '/' + path;
			}
			return path;
		}
	}, {
		key: 'getHash',
		value: function getHash() {
			return this.link.hash;
		}
	}]);

	return Link;
}();

exports.default = Link;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(3);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _index2.default; // this is here for webpack to expose SwupPlugin as window.SwupPlugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(4);

var _plugin2 = _interopRequireDefault(_plugin);

var _scrl = __webpack_require__(5);

var _scrl2 = _interopRequireDefault(_scrl);

var _helpers = __webpack_require__(6);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing a Scroll Plugin.
 * @extends Plugin
 */
var ScrollPlugin = function (_Plugin) {
	_inherits(ScrollPlugin, _Plugin);

	/**
  * Constructor
  * @param {?object} options the plugin options
  */
	function ScrollPlugin(options) {
		_classCallCheck(this, ScrollPlugin);

		var _this = _possibleConstructorReturn(this, (ScrollPlugin.__proto__ || Object.getPrototypeOf(ScrollPlugin)).call(this));

		_this.name = 'ScrollPlugin';

		_this.getAnchorElement = function () {
			var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			// Look for a custom function provided via the plugin options
			if (typeof _this.options.getAnchorElement === 'function') {
				return _this.options.getAnchorElement(hash);
			}
			// Look for a the built-in function in swup, added in swup 2.0.16
			if (typeof _this.swup.getAnchorElement === 'function') {
				return _this.swup.getAnchorElement(hash);
			}
			// Finally, return a native browser query
			return document.querySelector(hash);
		};

		_this.getOffset = function () {
			var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			// If options.offset is a function, apply and return it
			if (typeof _this.options.offset === 'function') {
				return parseInt(_this.options.offset(element), 10);
			}
			// Otherwise, return the sanitized offset
			return parseInt(_this.options.offset, 10);
		};

		_this.onSamePage = function () {
			_this.swup.scrollTo(0, _this.shouldAnimate('samePage'));
		};

		_this.onSamePageWithHash = function (event) {
			var link = event.delegateTarget;
			_this.maybeScrollToAnchor(link.hash, 'samePageWithHash');
		};

		_this.onTransitionStart = function (popstate) {
			if (_this.options.doScrollingRightAway && !_this.swup.scrollToElement) {
				_this.doScrollingBetweenPages(popstate);
			}
		};

		_this.onContentReplaced = function (popstate) {
			if (!_this.options.doScrollingRightAway || _this.swup.scrollToElement) {
				_this.doScrollingBetweenPages(popstate);
			}

			_this.restoreScrollContainers(popstate);
		};

		_this.doScrollingBetweenPages = function (popstate) {
			var swup = _this.swup;

			// Bail early on popstate and inactive `animateHistoryBrowsing`
			if (popstate && !swup.options.animateHistoryBrowsing) {
				return;
			}

			// Try scrolling to a given anchor
			if (_this.maybeScrollToAnchor(swup.scrollToElement, 'betweenPages')) {
				swup.scrollToElement = null;
				return;
			}

			// Finally, scroll to either the stored scroll position or to the very top of the page
			var scrollPositions = _this.getStoredScrollPositions((0, _helpers.getCurrentUrl)()) || {};
			var top = scrollPositions.window && scrollPositions.window.top || 0;
			// Give possible JavaScript time to execute before scrolling
			requestAnimationFrame(function () {
				return swup.scrollTo(top, _this.shouldAnimate('betweenPages'));
			});
		};

		_this.onWillReplaceContent = function () {
			_this.storeScrollPositions(_this.previousUrl);
			_this.previousUrl = (0, _helpers.getCurrentUrl)();
		};

		_this.onClickLink = function (event) {
			_this.maybeResetScrollPositions(event.delegateTarget);
		};

		var defaultOptions = {
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
			scrollContainers: '[data-swup-scroll-container]',
			shouldResetScrollPosition: function shouldResetScrollPosition(htmlAnchorElement) {
				return true;
			}
		};

		_this.options = _extends({}, defaultOptions, options);

		// This object will hold all scroll positions
		_this.scrollPositionsStore = {};
		// this URL helps with storing the current scroll positions on `willReplaceContent`
		_this.previousUrl = (0, _helpers.getCurrentUrl)();
		return _this;
	}

	/**
  * Runs if the plugin is mounted
  */


	_createClass(ScrollPlugin, [{
		key: 'mount',
		value: function mount() {
			var _this2 = this;

			var swup = this.swup;

			// add empty handlers array for scroll events
			swup._handlers.scrollDone = [];
			swup._handlers.scrollStart = [];

			// Initialize Scrl for smooth animations
			this.scrl = new _scrl2.default({
				onStart: function onStart() {
					return swup.triggerEvent('scrollStart');
				},
				onEnd: function onEnd() {
					return swup.triggerEvent('scrollDone');
				},
				onCancel: function onCancel() {
					return swup.triggerEvent('scrollDone');
				},
				friction: this.options.scrollFriction,
				acceleration: this.options.scrollAcceleration
			});

			// set scrollTo method of swup and animate based on current animateScroll option
			swup.scrollTo = function (offset) {
				var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

				if (animate) {
					_this2.scrl.scrollTo(offset);
				} else {
					swup.triggerEvent('scrollStart');
					window.scrollTo(0, offset);
					swup.triggerEvent('scrollDone');
				}
			};

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

	}, {
		key: 'unmount',
		value: function unmount() {
			var swup = this.swup;
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

	}, {
		key: 'shouldAnimate',
		value: function shouldAnimate(context) {
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


		/**
   * Get the offset for a scroll
   * @param {(HtmlELement|null)} element
   * @returns {number}
   */


		/**
   * Handles `samePage`
   */


		/**
   * Handles `onSamePageWithHash`
   * @param {PointerEvent} event
   */

	}, {
		key: 'maybeScrollToAnchor',


		/**
   * Attempts to scroll to an anchor
   * @param {string} hash
   * @param {string} context
   * @returns {boolean}
   */
		value: function maybeScrollToAnchor(hash, context) {
			// Bail early if the hash is null
			if (hash == null) {
				return false;
			}
			var element = this.getAnchorElement(hash);
			if (!element) {
				console.warn('Element ' + hash + ' not found');
				return false;
			}
			if (!(element instanceof Element)) {
				console.warn('Element ' + hash + ' is not a DOM node');
				return false;
			}
			var top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
			this.swup.scrollTo(top, this.shouldAnimate(context));
			return true;
		}

		/**
   * Handles `transitionStart`
   * @param {PopStateEvent} popstate
   */


		/**
   * Handles `contentReplaced`
   * @param {PopStateEvent} popstate
   */


		/**
   * Scrolls the window, based on context
   * @param {(PopStateEvent|boolean)} popstate
   * @returns {void}
   */


		/**
   * Stores the current scroll positions for the URL we just came from
   */


		/**
   * Handles `clickLink`
   * @param {PointerEvent}
   * @returns {void}
   */

	}, {
		key: 'maybeResetScrollPositions',


		/**
   * Deletes the scroll positions for the URL a link is pointing to,
   * if shouldResetScrollPosition evaluates to true
   * @param {HTMLAnchorElement} htmlAnchorElement
   * @returns {void}
   */
		value: function maybeResetScrollPositions(htmlAnchorElement) {
			if (!this.options.shouldResetScrollPosition(htmlAnchorElement)) {
				return;
			}
			var url = new _helpers.Link(htmlAnchorElement).getAddress();
			this.resetScrollPositions(url);
		}

		/**
   * Stores the scroll positions for the current URL
   * @param {string} url
   * @returns {void}
   */

	}, {
		key: 'storeScrollPositions',
		value: function storeScrollPositions(url) {
			// retrieve the current scroll position for all containers
			var containers = (0, _utils.queryAll)(this.options.scrollContainers).map(function (el) {
				return {
					top: el.scrollTop,
					left: el.scrollLeft
				};
			});

			// construct the final object entry, with the window scroll positions added
			this.scrollPositionsStore[url] = {
				window: { top: window.scrollY, left: window.scrollX },
				containers: containers
			};
		}

		/**
   * Resets stored scroll positions for a given URL
   * @param {string} url
   */

	}, {
		key: 'resetScrollPositions',
		value: function resetScrollPositions(url) {
			delete this.scrollPositionsStore[url];
			this.scrollPositionsStore[url] = null;
		}

		/**
   * Get the stored scroll positions for a given URL from the cache
   * @returns {(object|null)}
   */

	}, {
		key: 'getStoredScrollPositions',
		value: function getStoredScrollPositions(url) {
			return this.scrollPositionsStore[url];
		}

		/**
   * Restore the scroll positions for all matching scrollContainers
   * @returns void
   */

	}, {
		key: 'restoreScrollContainers',
		value: function restoreScrollContainers(popstate) {
			// get the stored scroll positions from the cache
			var scrollPositions = this.getStoredScrollPositions((0, _helpers.getCurrentUrl)()) || {};
			if (scrollPositions.containers == null) {
				return;
			}

			// cycle through all containers on the current page and restore their scroll positions, if appropriate
			(0, _utils.queryAll)(this.options.scrollContainers).forEach(function (el, index) {
				var scrollPosition = scrollPositions.containers[index];
				if (scrollPosition == null) return;
				el.scrollTop = scrollPosition.top;
				el.scrollLeft = scrollPosition.left;
			});
		}
	}]);

	return ScrollPlugin;
}(_plugin2.default);

exports.default = ScrollPlugin;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
    function Plugin() {
        _classCallCheck(this, Plugin);

        this.isSwupPlugin = true;
    }

    _createClass(Plugin, [{
        key: "mount",
        value: function mount() {
            // this is mount method rewritten by class extending
            // and is executed when swup is enabled with plugin
        }
    }, {
        key: "unmount",
        value: function unmount() {
            // this is unmount method rewritten by class extending
            // and is executed when swup with plugin is disabled
        }
    }, {
        key: "_beforeMount",
        value: function _beforeMount() {
            // here for any future hidden auto init
        }
    }, {
        key: "_afterUnmount",
        value: function _afterUnmount() {}
        // here for any future hidden auto-cleanup


        // this is here so we can tell if plugin was created by extending this class

    }]);

    return Plugin;
}();

exports.default = Plugin;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scrl = function Scrl(options) {
    var _this = this;

    _classCallCheck(this, Scrl);

    this._raf = null;
    this._positionY = 0;
    this._velocityY = 0;
    this._targetPositionY = 0;
    this._targetPositionYWithOffset = 0;
    this._direction = 0;

    this.scrollTo = function (offset) {
        if (offset && offset.nodeType) {
            // the offset is element
            _this._targetPositionY = Math.round(offset.getBoundingClientRect().top + window.pageYOffset);
        } else if (parseInt(_this._targetPositionY) === _this._targetPositionY) {
            // the offset is a number
            _this._targetPositionY = Math.round(offset);
        } else {
            console.error('Argument must be a number or an element.');
            return;
        }

        // don't animate beyond the document height
        if (_this._targetPositionY > document.documentElement.scrollHeight - window.innerHeight) {
            _this._targetPositionY = document.documentElement.scrollHeight - window.innerHeight;
        }

        // calculated required values
        _this._positionY = document.body.scrollTop || document.documentElement.scrollTop;
        _this._direction = _this._positionY > _this._targetPositionY ? -1 : 1;
        _this._targetPositionYWithOffset = _this._targetPositionY + _this._direction;
        _this._velocityY = 0;

        if (_this._positionY !== _this._targetPositionY) {
            // start animation
            _this.options.onStart();
            _this._animate();
        } else {
            // page is already at the position
            _this.options.onAlreadyAtPositions();
        }
    };

    this._animate = function () {
        var distance = _this._update();
        _this._render();

        if (_this._direction === 1 && _this._targetPositionY > _this._positionY || _this._direction === -1 && _this._targetPositionY < _this._positionY) {
            // calculate next position
            _this._raf = requestAnimationFrame(_this._animate);
            _this.options.onTick();
        } else {
            // finish and set position to the final position
            _this._positionY = _this._targetPositionY;
            _this._render();
            _this._raf = null;
            _this.options.onTick();
            _this.options.onEnd();
            // this.triggerEvent('scrollDone')
        }
    };

    this._update = function () {
        var distance = _this._targetPositionYWithOffset - _this._positionY;
        var attraction = distance * _this.options.acceleration;

        _this._velocityY += attraction;

        _this._velocityY *= _this.options.friction;
        _this._positionY += _this._velocityY;

        return Math.abs(distance);
    };

    this._render = function () {
        window.scrollTo(0, _this._positionY);
    };

    // default options
    var defaults = {
        onAlreadyAtPositions: function onAlreadyAtPositions() {},
        onCancel: function onCancel() {},
        onEnd: function onEnd() {},
        onStart: function onStart() {},
        onTick: function onTick() {},
        friction: .7, // 1 - .3
        acceleration: .04

        // merge options
    };this.options = _extends({}, defaults, options);

    // set reverse friction
    if (options && options.friction) {
        this.options.friction = 1 - options.friction;
    }

    // register listener for cancel on wheel event
    window.addEventListener('mousewheel', function (event) {
        if (_this._raf) {
            _this.options.onCancel();
            cancelAnimationFrame(_this._raf);
            _this._raf = null;
        }
    }, {
        passive: true
    });
};

exports.default = Scrl;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanupAnimationClasses = exports.Link = exports.markSwupElements = exports.normalizeUrl = exports.getCurrentUrl = exports.transitionProperty = exports.transitionEnd = exports.fetch = exports.getDataFromHtml = exports.createHistoryRecord = exports.classify = undefined;

var _classify = __webpack_require__(7);

var _classify2 = _interopRequireDefault(_classify);

var _createHistoryRecord = __webpack_require__(8);

var _createHistoryRecord2 = _interopRequireDefault(_createHistoryRecord);

var _getDataFromHtml = __webpack_require__(9);

var _getDataFromHtml2 = _interopRequireDefault(_getDataFromHtml);

var _fetch = __webpack_require__(10);

var _fetch2 = _interopRequireDefault(_fetch);

var _transitionEnd = __webpack_require__(11);

var _transitionEnd2 = _interopRequireDefault(_transitionEnd);

var _transitionProperty = __webpack_require__(12);

var _transitionProperty2 = _interopRequireDefault(_transitionProperty);

var _getCurrentUrl = __webpack_require__(13);

var _getCurrentUrl2 = _interopRequireDefault(_getCurrentUrl);

var _normalizeUrl = __webpack_require__(14);

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var _markSwupElements = __webpack_require__(15);

var _markSwupElements2 = _interopRequireDefault(_markSwupElements);

var _Link = __webpack_require__(1);

var _Link2 = _interopRequireDefault(_Link);

var _cleanupAnimationClasses = __webpack_require__(16);

var _cleanupAnimationClasses2 = _interopRequireDefault(_cleanupAnimationClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classify = exports.classify = _classify2.default;
var createHistoryRecord = exports.createHistoryRecord = _createHistoryRecord2.default;
var getDataFromHtml = exports.getDataFromHtml = _getDataFromHtml2.default;
var fetch = exports.fetch = _fetch2.default;
var transitionEnd = exports.transitionEnd = _transitionEnd2.default;
var transitionProperty = exports.transitionProperty = _transitionProperty2.default;
var getCurrentUrl = exports.getCurrentUrl = _getCurrentUrl2.default;
var normalizeUrl = exports.normalizeUrl = _normalizeUrl2.default;
var markSwupElements = exports.markSwupElements = _markSwupElements2.default;
var Link = exports.Link = _Link2.default;
var cleanupAnimationClasses = exports.cleanupAnimationClasses = _cleanupAnimationClasses2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var classify = function classify(text) {
	var output = text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
	.replace(/\//g, '-') // Replace / with -
	.replace(/[^\w\-]+/g, '') // Remove all non-word chars
	.replace(/\-\-+/g, '-') // Replace multiple - with single -
	.replace(/^-+/, '') // Trim - from start of text
	.replace(/-+$/, ''); // Trim - from end of text
	if (output[0] === '/') output = output.splice(1);
	if (output === '') output = 'homepage';
	return output;
};

exports.default = classify;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var createHistoryRecord = function createHistoryRecord(url) {
	window.history.pushState({
		url: url || window.location.href.split(window.location.hostname)[1],
		random: Math.random(),
		source: 'swup'
	}, document.getElementsByTagName('title')[0].innerText, url || window.location.href.split(window.location.hostname)[1]);
};

exports.default = createHistoryRecord;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = __webpack_require__(0);

var getDataFromHtml = function getDataFromHtml(html, containers) {
	var fakeDom = document.createElement('html');
	fakeDom.innerHTML = html;
	var blocks = [];

	containers.forEach(function (selector) {
		if ((0, _utils.query)(selector, fakeDom) == null) {
			console.error('Container ' + selector + ' not found on page.');
			return null;
		} else {
			if ((0, _utils.queryAll)(selector).length !== (0, _utils.queryAll)(selector, fakeDom).length) {
				console.warn('Mismatched number of containers found on new page.');
			}
			(0, _utils.queryAll)(selector).forEach(function (item, index) {
				(0, _utils.queryAll)(selector, fakeDom)[index].setAttribute('data-swup', blocks.length);
				blocks.push((0, _utils.queryAll)(selector, fakeDom)[index].outerHTML);
			});
		}
	});

	var json = {
		title: fakeDom.querySelector('title').innerText,
		pageClass: fakeDom.querySelector('body').className,
		originalContent: html,
		blocks: blocks
	};

	// to prevent memory leaks
	fakeDom.innerHTML = '';
	fakeDom = null;

	return json;
};

exports.default = getDataFromHtml;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fetch = function fetch(setOptions) {
	var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	var defaults = {
		url: window.location.pathname + window.location.search,
		method: 'GET',
		data: null,
		headers: {}
	};

	var options = _extends({}, defaults, setOptions);

	var request = new XMLHttpRequest();

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			if (request.status !== 500) {
				callback(request);
			} else {
				callback(request);
			}
		}
	};

	request.open(options.method, options.url, true);
	Object.keys(options.headers).forEach(function (key) {
		request.setRequestHeader(key, options.headers[key]);
	});
	request.send(options.data);
	return request;
};

exports.default = fetch;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var transitionEnd = function transitionEnd() {
	if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
		return 'webkitTransitionEnd';
	} else {
		return 'transitionend';
	}
};

exports.default = transitionEnd;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var transitionProperty = function transitionProperty() {
	if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
		return 'WebkitTransition';
	} else {
		return 'transition';
	}
};

exports.default = transitionProperty;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getCurrentUrl = function getCurrentUrl() {
	return window.location.pathname + window.location.search;
};

exports.default = getCurrentUrl;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Link = __webpack_require__(1);

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalizeUrl = function normalizeUrl(url) {
	return new _Link2.default(url).getAddress();
};

exports.default = normalizeUrl;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = __webpack_require__(0);

var markSwupElements = function markSwupElements(element, containers) {
	var blocks = 0;

	containers.forEach(function (selector) {
		if ((0, _utils.query)(selector, element) == null) {
			console.error('Container ' + selector + ' not found on page.');
		} else {
			(0, _utils.queryAll)(selector).forEach(function (item, index) {
				(0, _utils.queryAll)(selector, element)[index].setAttribute('data-swup', blocks);
				blocks++;
			});
		}
	});
};

exports.default = markSwupElements;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var cleanupAnimationClasses = function cleanupAnimationClasses() {
  document.documentElement.className.split(' ').forEach(function (classItem) {
    if (
    // remove "to-{page}" classes
    new RegExp('^to-').test(classItem) ||
    // remove all other classes
    classItem === 'is-changing' || classItem === 'is-rendering' || classItem === 'is-popstate') {
      document.documentElement.classList.remove(classItem);
    }
  });
};

exports.default = cleanupAnimationClasses;

/***/ })
/******/ ]);
});