# 001 - Personal Portfolio Page

A clean, modern portfolio template built with pure HTML, CSS, and vanilla JavaScript. Designed as a reusable starting point — swap in your own content and make it yours.

## Preview

![Personal Portfolio Page](../../images/001.png)

## Features

- **Dark / Light mode** toggle with localStorage persistence
- **Typing animation** cycling through taglines in the hero
- **Scroll-triggered reveals** with staggered timing
- **Animated stat counters** and skill progress bars
- **Floating tech cards** orbiting the profile image
- **Glassmorphism navbar** with blur on scroll
- **Responsive layout** — works on mobile, tablet, and desktop
- **Contact form** with submit feedback (UI only)

## Tech Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Grid, Flexbox, custom properties, animations |
| JavaScript (ES6) | DOM manipulation, Intersection Observer, localStorage |
| Google Fonts | Inter + Sora typefaces |
| Font Awesome 6 | Icons throughout |
| Unsplash | Placeholder images |

## Structure

```
001 - Personal Portfolio Page/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run

Open `index.html` in any browser. No build tools or dependencies required.

## Sections

1. **Hero** — Name, typing tagline, CTA buttons, stats, profile image with orbital rings
2. **About** — Bio, workspace image, experience badge, highlight cards
3. **Skills** — 6 skill cards with brand-colored icons and animated progress bars
4. **Projects** — 3 featured project cards with hover overlays and action links
5. **Contact** — Info cards + form with submit feedback
6. **Footer** — Brand column, navigation links, social links, back-to-top button

## Customization

- **Colors** — Edit the CSS custom properties in `css/style.css` under `:root` and `[data-theme]` blocks
- **Content** — Replace names, images, and text directly in `index.html`
- **Typing phrases** — Update the `phrases` array in `js/script.js`
