# 007 - Digital Clock

A live-updating digital clock with hours, minutes, and seconds. Includes 12/24-hour toggle, greeting, date display, and world clocks.

## Preview

![Digital Clock](../images/007.png)

## Features

- **Live time** updating every second with animated tick on the seconds digit
- **12H / 24H toggle** with AM/PM badge that hides in 24-hour mode
- **Dynamic greeting** — Good Morning / Afternoon / Evening / Night based on the hour
- **Full date display** — day of week, month, date, year
- **Blinking separators** between hours, minutes, and seconds
- **4 world clocks** — London, New York, Tokyo, Dubai with GMT offset labels
- **World clocks respect format** — switch between 12H and 24H applies to all
- **Subtle ambient glow** behind the clock
- **Responsive** — scales down cleanly on mobile

## Tech Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure |
| CSS3 | Custom properties, keyframe animations, responsive grid |
| JavaScript (ES6) | Date API, setInterval, timezone offset math |
| Google Fonts | Outfit, Inter, JetBrains Mono |
| Font Awesome 6 | Globe icon |

## Structure

```
007 - Digital Clock/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run

Open `index.html` in any browser. No build tools required.
