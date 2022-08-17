# Swup Scroll plugin

Adds awesome "acceleration based" automatic scrolling into the process of transition. The scrolling behaviour is customizable using options (see below).

## Installation

This plugin can be installed with npm

```bash
npm install @swup/scroll-plugin
```

and included with an import:

```shell
import SwupScrollPlugin from '@swup/scroll-plugin';
```

or included from the dist folder

```html
<script src="./dist/SwupScrollPlugin.js"></script>
```

## Usage

To run this plugin, include an instance in the swup options.

```javascript
const swup = new Swup({
  plugins: [new SwupScrollPlugin()]
});
```

## Options

### doScrollingRightAway

`doScrollingRightAway` defines if swup is supposed to wait for the replace of the page to scroll to the top.

### animateScroll

`animateScroll` defines whether the scroll animation is enabled or swup simply sets the scroll
without animation instead. Passing `true` or `false` will enable or disable all scroll animations.
For finer control, you can pass an object:

```javascript
{
  animateScroll: {
    betweenPages: true,
    samePageWithHash: true,
    samePage: true
  }
}
```
💡 We encourage you to respect user preferences when setting the `animateScroll` option:
```javascript
// Using a simple boolean...
{
  animateScroll: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
// ...or this little monster, with full control over everything:
{
  animateScroll: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : {
    betweenPages: true,
    samePageWithHash: true,
    samePage: true
  }
}
```

### scrollFriction and scrollAcceleration

The animation behavior of the scroll animation can be adjusted by setting `scrollFriction` and `scrollAcceleration`.

### getAnchorElement

Customize how the scroll target is found on the page. Defaults to standard browser behavior (`#id` first, `a[name]` second).💡💡

```javascript
{
  // Use a custom data attribute instead of id
  getAnchorElement: hash => {
    hash = hash.replace('#', '')
    return document.querySelector(`[data-scroll-target="${hash}"]`)
  }
}
```

### Offset

Offset to substract from the final scroll position, to account for fixed headers. Can be either a number or a function that returns the offset.

```javascript
{
  // Number: fixed offset in px
  offset: 30,

  // Function: calculate offset before scrolling
  offset: () => document.querySelector('#header').offsetHeight,

  // The scroll target element is passed into the function
  offset: target => target.offsetHeight * 2,
}
```

### Scroll Containers

Scroll Plugin helps you with restoring the scroll positions of your overflowing divs (or any other element that has overflow) if you navigate back and forward through the browser history. Just add the attribute `[data-swup-scroll-container]` to the elements you want to be restored. The selector can be customized with the option `scrollContainers`, which accepts a selector string:

```js
{
    scrollContainers: `.my-overflowing-div, .my-other-div`
}
```

Every time you click a link, Scroll Plugin will wipe the stored scroll positions for the URL the link points towards. You can opt-in to preserving these scroll positions by using the callback `shouldRestoreScrollPosition`:

```js
{
    // don't reset the scroll positions for links that conain the class "backlink"
    shouldRestoreScrollPosition: (htmlAnchorElement) => {
      return htmlAnchorElement.classList.contains('backlink');
    }
}
```

### Default options

```javascript
new SwupScrollPlugin({
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
    shouldRestoreScrollPosition: (htmlAnchorElement) => {
      return false;
    }
});
```

## Changes of the swup instance

Scroll Plugin adds the method `scrollTo` to the swup instance, which can be used for custom scrolling.
The method accepts an offset in pixels and a boolean, if the scroll position should be animated:

```js
// will animate the scroll position of the window to 2000px
swup.scrollTo(2000, true);
```

The Plugin also adds two new events `scrollStart` and `scrollDone` to swup, that can be listened to with the `on` method:

```js
swup.on('scrollStart', () => {
  console.log('Swup started scrolling');
});
swup.on('scrollDone', () => {
  console.log('Swup finished scrolling');
});
```
