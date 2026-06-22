# 005 - Color Picker App

An interactive color picker tool where you can pick, adjust, preview, copy, and save colors in HEX, RGB, and HSL formats.

## Preview

![Color Picker App](../../images/005.png)

## Features

- **Live preview card** that updates background and auto-adjusts text contrast (black/white)
- **Native color picker** input for quick selection
- **HEX input** — type or paste a hex code, auto-syncs all fields
- **RGB inputs** — individual R, G, B number fields
- **HSL inputs** — individual H, S, L number fields
- **RGB sliders** — color-coded range sliders (red, green, blue) with live value display
- **One-click copy** — copy HEX, RGB, or HSL to clipboard with toast confirmation
- **Contrast badge** — shows WCAG contrast rating (AAA / AA / Fail) against white/black
- **Random color** button for inspiration
- **Saved palette** — save colors to a localStorage-backed palette, click to reload, X to delete
- **Toast notifications** for copy/save actions

## How All Inputs Stay In Sync

Changing any input (native picker, hex, rgb, hsl, sliders) updates all other inputs, the preview, sliders, and the contrast badge simultaneously.

## Tech Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Form inputs, semantic structure |
| CSS3 | Custom properties, slider styling, animations |
| JavaScript (ES6) | Color conversions (RGB/HEX/HSL), Clipboard API, localStorage |
| Google Fonts | Inter + JetBrains Mono |
| Font Awesome 6 | UI icons |

## Structure

```
005 - Color Picker App/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run

Open `index.html` in any browser. No build tools required.
