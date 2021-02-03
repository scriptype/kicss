# Keep It CSS

## What?

Let's use more CSS custom properties to help ourselves with communicating the interactivity between JavaScript and CSS! Instead of generating and manipulating dynamic styles in JavaScript, we can take advantage of the custom CSS properties to provide CSS with the seeds of interactivity. So that we can implement a greater portion of interactivity right in the CSS without sacrificing from the dynamic nature of styling that we often need.

KICSS is just a mental guideline for creating dynamic UIs. Whether you use a CSS-in-JS tech or CSS Modules or a pre-processor language is irrelevant. However, it may reduce your need for these tools.

KICSS stands for "Keep It CSS" and it refers to finding ways for keeping dynamic styling in CSS. Naming is inspired by the famous programming motto KISS.

It's also the name of a small JavaScript library that can help you achieve that goal.

Please check the examples below to understand the idea better.

## Why?

Simply because CSS is already an excellent language for dealing with the styling on web. If only CSS had built-in ways to declare styles that are based on more real-time user events and dynamically built UIs. But we can do it ourselves!

If followed, this approach should help you with replacing much of your dynamically-generated CSS code with static, pure CSS that can deliver the same dynamic styling needs.

Depending on the case, it <em>may</em> eliminate your need for a 3rd party animation library.

This way of thinking will force you to learn more about what CSS can do for you.

If you (optionally) use the JavaScript library, you can easily interpolate dynamic values and create nice, real-time animations.

## Examples

*   [Camera](https://enes.in/kicss/examples/camera)
*   [Doodle 1](https://enes.in/kicss/examples/doodle-1)
*   [Doodle 2](https://enes.in/kicss/examples/doodle-2)
*   [Carousel Horizontal](https://enes.in/kicss/examples/carousel-horizontal)
*   [Carousel Horizontal 2](https://enes.in/kicss/examples/carousel-horizontal-2)
*   [Parallax Cursor](https://enes.in/kicss/examples/parallax-cursor)
*   [Parallax Page](https://enes.in/kicss/examples/parallax-page)
*   [Parallax Scroll](https://enes.in/kicss/examples/parallax-scroll)
*   [Particles Following Cursor](https://enes.in/kicss/examples/particles-following-cursor)
*   [Progress Bar](https://enes.in/kicss/examples/progressbar)
*   [Progress Car](https://enes.in/kicss/examples/progresscar)
*   [Preserved Contrast](https://enes.in/kicss/examples/preserved-contrast)
*   [Scroll Content](https://enes.in/kicss/examples/scroll-content)
*   [Staggered Animation](https://enes.in/kicss/examples/staggered-animation)
*   [Telegram Spinner](https://enes.in/kicss/examples/telegram-spinner)

## Installation and usage of the JavaScript library

### Installation

```sh
npm install --save kicss

# or

yarn add kicss
```

### Usage

#### Option 1: Include the script in HTML:

To access KICSS from global `window` object:

```html
<script type="module" src="kicss.js"></script>
```

Or:

```html
<script type="module" src="kicss.js?report=cursor,scroll"></script>
```

Available global properties to ask: `cursor`, `scroll`.

#### Option 2: Import as module

```js
import kicss from 'kicss'
```

Or:

```js
import { reportGlobals, reportVariable, reportScroll } from 'kicss'
```

## API

### reportScroll(name | options, direction | options)

Will report scroll values. Should be used as the scroll event handler on the element.

Parameters:

*   name: string
*   direction: 'horizontal' | 'vertical'
*   options:
    *   name: string
    *   direction: 'horizontal' | 'vertical'
    *   interpolations?: Interpolation[]

Usage examples: [Carousel Horizontal](https://enes.in/kicss/examples/carousel-horizontal), [Scroll Content](https://enes.in/kicss/examples/scroll-content)

### reportVariable(name, value | options)

Will assign a css property to an element if scope is present, otherwise to :root

If value is provided as a function, then it will be treated as a responsive variable and refreshed if window dimensions change.

Parameters:

*   name: string
*   value: function | any
*   options:
    *   value: function | any
    *   scope?: DOMNode (default: documentElement)

Usage examples: [Carousel Horizontal](https://enes.in/kicss/examples/carousel-horizontal), [Scroll Content](https://enes.in/kicss/examples/scroll-content) [Staggered Animation](https://enes.in/kicss/examples/staggered-animation) [Progress Car](https://enes.in/kicss/examples/progresscar)

### reportIndex(selector, options)

Will run the query for the given selector, and assign an index css property to each item. If the 'rowIndexBy' option is present, a row index will be also assigned.

Parameters:

*   selector: string
*   options:
    *   indexVariableName?: string (default: '--index')
    *   rowIndexVariableName?: string (default: '--row-index')
    *   rowIndexBy?: number

Usage examples: [Doodle 1](https://enes.in/kicss/examples/doodle-1), [Doodle 2](https://enes.in/kicss/examples/doodle-2) [Staggered Animation](https://enes.in/kicss/examples/staggered-animation)

### reportGlobals(options)

Will report global properties.

options?: (default: { scroll: true, cursor: true })

*   scroll?: boolean (default: true)
*   cursor?: boolean (default: true)

Usage examples: [Doodle 1](https://enes.in/kicss/examples/doodle-1), [Doodle 2](https://enes.in/kicss/examples/doodle-2) [Preserved Contrast](https://enes.in/kicss/examples/preserved-contrast)
