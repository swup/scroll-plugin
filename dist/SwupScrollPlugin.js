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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(1);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _index2.default; // this is here for webpack to expose SwupPlugin as window.SwupPlugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(2);

var _plugin2 = _interopRequireDefault(_plugin);

var _scrl = __webpack_require__(3);

var _scrl2 = _interopRequireDefault(_scrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPlugin = function (_Plugin) {
    _inherits(ScrollPlugin, _Plugin);

    function ScrollPlugin(options) {
        _classCallCheck(this, ScrollPlugin);

        var _this = _possibleConstructorReturn(this, (ScrollPlugin.__proto__ || Object.getPrototypeOf(ScrollPlugin)).call(this));

        _this.name = "ScrollPlugin";

        _this.getAnchorElement = function () {
            var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            if (typeof _this.options.getAnchorElement === 'function') {
                return _this.options.getAnchorElement(hash);
            } else if (typeof _this.swup.getAnchorElement === 'function') {
                // Helper only added in swup 2.0.16
                return _this.swup.getAnchorElement(hash);
            } else {
                return document.querySelector(hash);
            }
        };

        _this.getOffset = function () {
            var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            switch (_typeof(_this.options.offset)) {
                case 'number':
                    return _this.options.offset;
                case 'function':
                    return parseInt(_this.options.offset(element), 10);
                default:
                    return parseInt(_this.options.offset, 10);
            }
        };

        _this.onSamePage = function () {
            _this.swup.scrollTo(0, _this.shouldAnimate('samePage'));
        };

        _this.onSamePageWithHash = function (event) {
            var link = event.delegateTarget;
            var element = _this.getAnchorElement(link.hash);
            if (!element) {
                console.warn('Element ' + link.hash + ' not found');
                return;
            }
            if (!(element instanceof Element)) {
                console.warn('Element ' + link.hash + ' is not a DOM node');
                return;
            }
            var top = element.getBoundingClientRect().top + window.pageYOffset - _this.getOffset(element);
            _this.swup.scrollTo(top, _this.shouldAnimate('samePageWithHash'));
        };

        _this.onTransitionStart = function (popstate) {
            if (_this.options.doScrollingRightAway && !_this.swup.scrollToElement) {
                _this.doScrolling(popstate);
            }
        };

        _this.onContentReplaced = function (popstate) {
            if (!_this.options.doScrollingRightAway || _this.swup.scrollToElement) {
                _this.doScrolling(popstate);
            }

            if (popstate) {
                _this.restoreScrollPositions();
            }
        };

        _this.doScrolling = function (popstate) {
            var swup = _this.swup;

            if (!popstate || swup.options.animateHistoryBrowsing) {
                if (swup.scrollToElement != null) {
                    var element = _this.getAnchorElement(swup.scrollToElement);
                    if (element != null) {
                        var top = element.getBoundingClientRect().top + window.pageYOffset - _this.getOffset(element);
                        swup.scrollTo(top, _this.shouldAnimate('betweenPages'));
                    } else {
                        console.warn('Element ' + swup.scrollToElement + ' not found');
                    }
                    swup.scrollToElement = null;
                } else {
                    swup.scrollTo(0, _this.shouldAnimate('betweenPages'));
                }
            }
        };

        _this.onWillReplaceContent = function () {
            _this.storeScrollPositions(_this.lastUrl);
            _this.lastUrl = window.location.href;
        };

        _this.onClickLink = function (e) {
            _this.deleteStoredScrollPositions(e.delegateTarget.href);
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
            offset: 0
        };

        _this.options = _extends({}, defaultOptions, options);

        // This object will hold all scroll positions
        _this.scrollPositionsStore = {};
        _this.lastUrl = window.location.href;
        return _this;
    }

    _createClass(ScrollPlugin, [{
        key: 'mount',
        value: function mount() {
            var _this2 = this;

            var swup = this.swup;

            // add empty handlers array for scroll events
            swup._handlers.scrollDone = [];
            swup._handlers.scrollStart = [];

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

            window.history.scrollRestoration = 'auto';
        }
    }, {
        key: 'shouldAnimate',
        value: function shouldAnimate(type) {
            if (typeof this.options.animateScroll === 'boolean') {
                return this.options.animateScroll;
            } else {
                return this.options.animateScroll[type];
            }
        }
    }, {
        key: 'storeScrollPositions',


        /**
         * Stores the scroll positions for the current URL
         * @param {string} url 
         */
        value: function storeScrollPositions(url) {
            // create an object to store the scroll positions
            var storeEntry = {
                window: { top: window.scrollY, left: window.scrollX },
                elements: []
                // fill up the object with scroll positions for each matching element
            };var $elements = document.querySelectorAll('[data-swup-restore-scroll]');
            $elements.forEach(function (el) {
                return storeEntry.elements.push({
                    top: el.scrollTop,
                    left: el.scrollLeft
                });
            });
            // put the object into the store
            this.scrollPositionsStore[url] = storeEntry;
        }

        /**
         * Deletes stored scroll positions for a given URL
         * @param {string} url 
         */

    }, {
        key: 'deleteStoredScrollPositions',
        value: function deleteStoredScrollPositions(url) {
            delete this.scrollPositionsStore[url];
            this.scrollPositionsStore[url] = null;
        }

        /**
         * Restore the scroll positions for all matching elements
         * @returns void
         */

    }, {
        key: 'restoreScrollPositions',
        value: function restoreScrollPositions() {
            var swup = this.swup;
            // get the stored scroll positions from the cache
            var scrollPositions = this.scrollPositionsStore[window.location.href];
            if (scrollPositions == null) {
                return;
            }
            if (scrollPositions.elements == null) {
                return;
            }
            // cycle through all elements on the current page and restore their scroll positions, if appropriate
            var $elements = document.querySelectorAll('[data-swup-restore-scroll]');
            $elements.forEach(function (el, index) {
                var scrollPosition = scrollPositions.elements[index];
                if (scrollPosition == null) return;
                el.scrollTop = scrollPosition.top;
                el.scrollLeft = scrollPosition.left;
            });
            // also restore the scroll position of the window, if animateHistoryBrowsing is true
            if (swup.options.animateHistoryBrowsing) {
                swup.scrollTo(scrollPositions.window.top, this.shouldAnimate('betweenPages'));
            }
        }
    }]);

    return ScrollPlugin;
}(_plugin2.default);

exports.default = ScrollPlugin;

/***/ }),
/* 2 */
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
        value: function unmount() {}
        // this is unmount method rewritten by class extending
        // and is executed when swup with plugin is disabled


        // this is here so we can tell if plugin was created by extending this class

    }]);

    return Plugin;
}();

exports.default = Plugin;

/***/ }),
/* 3 */
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

/***/ })
/******/ ]);
});