# 006 - Background Changer

Click a button to randomize the page background. Supports solid colors, linear/radial gradients, and mesh gradients with a visual history.

## Preview

![Background Changer](../../images/006.png)

## Features

- **3 generation modes** — Solid color, Gradient (2 colors), Mesh (4-color blend)
- **Gradient direction controls** — left-to-right, diagonal, top-to-bottom, and radial
- **Smooth transitions** — background fades between colors
- **Auto text contrast** — all UI elements swap between light and dark text based on background luminance
- **Copy current value** — copies the HEX, gradient, or mesh CSS value to clipboard
- **Visual history** — last 20 backgrounds saved as clickable swatches, click to re-apply
- **Keyboard support** — press Space to generate
- **Toast notifications** for copy and apply actions

## Tech Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure |
| CSS3 | Glassmorphism UI, CSS custom properties, dynamic contrast swapping |
| JavaScript (ES6) | Random color generation, gradient building, Clipboard API, DOM |
| Google Fonts | Inter + JetBrains Mono |
| Font Awesome 6 | UI icons |

## Structure

```
006 - Background Changer/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run

Open `index.html` in any browser. No build tools required.
