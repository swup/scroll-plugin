# Changelog

## [4.0.0] - 2025-08-04

- Drop dependency on [gmrchk/scrl](https://github.com/gmrchk/scrl) in favor of a native scroll implemenation
- Support nested scroll containers
- Support scrolling both axis (top, left)
- New option `scrollFunction` to customize the scroll implementation
- Added unit and end-to-end tests

## [3.3.2] - 2024-02-05

- Pass temporary visit into scroll hooks

## [3.3.1] - 2023-09-27

- Use `@swup/cli` for bundling

## [3.3.0] - 2023-08-21

- Emulate CSS `:target` selector as `[data-swup-scroll-target]`

## [3.2.1] - 2023-08-21

- Fix scroll position reset on history visits

## [3.2.0] - 2023-08-20

- Allow controlling scroll animation in `visit.scroll.animate`
- Fix scrolling before animation
- Fix scroll position reset on API visits

## [3.1.1] - 2023-08-10

- Port to typescript
- Fix regression where scroll positions always were reset
- Require swup `>=4.2.0`

## [3.1.0] - 2023-08-09

- Allow updating hash and scroll target separately

## [3.0.0] - 2023-07-26

- Update for swup 4 compatibility

## [2.0.3] - 2023-06-12

- Make the plugin options optional

## [2.0.2] - 2023-03-02

- Correctly resolve URLs

## [2.0.1] - 2023-03-29

- Use shared browserslist config

## [2.0.0] - 2023-01-18

- Switch to microbundle
- Export native ESM module
- Upgrade scroll library

## [1.3.1] - 2022-08-30

- Wait for the next animationFrame before scrolling between pages

## [1.3.0] - 2022-08-19

- Store and restore scroll positions on the window and on overflowing divs
- Restore browser scrollRestoration on unmount

## [1.2.0] - 2022-08-07

- Allow fine-grained control over when to animate scroll
- Allow customizing how anchor element is found

## [1.1.1] - 2022-06-30

- Improve handling of scroll anchors with special characters

## [1.1.0] - 2021-03-13

- Allow setting custom scroll offset

## [1.0.0] - 2019-05-01

- Initial release

[4.0.0]: https://github.com/swup/scroll-plugin/releases/tag/4.0.0
[3.3.2]: https://github.com/swup/scroll-plugin/releases/tag/3.3.2
[3.3.1]: https://github.com/swup/scroll-plugin/releases/tag/3.3.1
[3.3.0]: https://github.com/swup/scroll-plugin/releases/tag/3.3.0
[3.2.1]: https://github.com/swup/scroll-plugin/releases/tag/3.2.1
[3.2.0]: https://github.com/swup/scroll-plugin/releases/tag/3.2.0
[3.1.1]: https://github.com/swup/scroll-plugin/releases/tag/3.1.1
[3.1.0]: https://github.com/swup/scroll-plugin/releases/tag/3.1.0
[3.0.0]: https://github.com/swup/scroll-plugin/releases/tag/3.0.0
[2.0.3]: https://github.com/swup/scroll-plugin/releases/tag/2.0.3
[2.0.2]: https://github.com/swup/scroll-plugin/releases/tag/2.0.2
[2.0.1]: https://github.com/swup/scroll-plugin/releases/tag/2.0.1
[2.0.0]: https://github.com/swup/scroll-plugin/releases/tag/2.0.0
[1.3.1]: https://github.com/swup/scroll-plugin/releases/tag/1.3.1
[1.3.0]: https://github.com/swup/scroll-plugin/releases/tag/1.3.0
[1.2.0]: https://github.com/swup/scroll-plugin/releases/tag/1.2.0
[1.1.1]: https://github.com/swup/scroll-plugin/releases/tag/1.1.1
[1.1.0]: https://github.com/swup/scroll-plugin/releases/tag/1.1.0
[1.0.0]: https://github.com/swup/scroll-plugin/releases/tag/1.0.0
