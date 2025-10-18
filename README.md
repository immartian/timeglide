# TimeGlide

Demo screenshots below focus on the component itself for clarity.

![Light Component](https://immartian.github.io/timeglide/assets/component-light.png)
![Dark 10‑Year Range](https://immartian.github.io/timeglide/assets/component-dark-10yr.png)

**A revolutionary ultra-minimal date selector that lets you glide through 150 years in a single gesture.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Size](https://img.shields.io/badge/size-8KB-orange.svg)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)

## Overview

TimeGlide reimagines date selection by replacing traditional calendar grids with an intuitive linear timeline. Select any date from 1900 to 2050 with unprecedented speed and minimal clicks. Perfect for applications requiring fast date input across large time ranges.

### Why TimeGlide?

Traditional date pickers require 5-10+ clicks to navigate years and months. TimeGlide reduces this to just **1-3 actions** for any date in a 150-year range.

## Demo

- Live: https://immartian.github.io/timeglide/
- Local: open `index.html` directly. The page shows multiple instances, range presets, and a theme switcher.

## Features

### Core Functionality
- **Linear Timeline** - All 150 years visible in one continuous slider
- **Drag Selection** - Smoothly glide to any year/month with mouse movement
- **Acceleration Controls** - Hold < > buttons to speed up (day → week → month)
- **Today Marker** - Permanent reference point with one-click return
- **Keyboard Support** - Arrow keys + 'T' shortcut for today

### Visual Design
- **Dark Minimal UI** - Distraction-free interface
- **Ruler Marks** - Year indicators for instant context (like a measuring tape)
- **Smooth Animations** - 60fps interactions with GPU acceleration
- **Responsive** - Works seamlessly on desktop and mobile

### Smart Details
- **Relative Time** - Shows "Today", "5 days ago", "Tomorrow"
- **Precision Fine-tuning** - Separate controls for exact date selection
- **Visual Feedback** - Date turns red when matching today
- **Hover Preview** - See dates instantly while hovering

## Installation

### Basic HTML
Simply copy the HTML file into your project:

```html
<!-- Container -->
<div id="timglide-container"></div>
<!-- UMD build -->
<script src="dist/timglide.umd.js"></script>
<script>
  const tg = new TimeGlide({ container: '#timglide-container' });
  tg.setTheme('auto');
  tg.getDate(); // -> Date
  // Listen without callbacks
  document.querySelector('#timglide-container').addEventListener('change', (e) => {
    console.log('Selected:', e.detail.date);
  });
  // Programmatic
  tg.setDate(new Date(2001, 0, 1));
  tg.destroy();
  // See index.html for more examples
  </script>
```

### NPM Package *(Coming Soon)*
```bash
npm install timglide
```

### CDN *(Coming Soon)*
```html
<script src="https://cdn.jsdelivr.net/npm/timglide/dist/timglide.min.js"></script>
```

## Usage

### Basic Implementation
```javascript
// Initialize TimeGlide
const dateSelector = new TimeGlide({
  container: '#date-selector',
  startDate: new Date(1900, 0, 1),
  endDate: new Date(2050, 11, 31),
  defaultDate: new Date(),
  theme: 'auto', // 'dark' | 'light' | 'auto'
  onChange: (date) => {
    console.log('Selected date:', date);
  }
});
```

### Get Selected Date
```javascript
const selectedDate = dateSelector.getDate();
```

### Set Date Programmatically
```javascript
dateSelector.setDate(new Date(2025, 0, 1));
```

### Listen Without Callbacks (DOM Event)
```javascript
document.querySelector('#date-selector').addEventListener('change', (e) => {
  console.log('Selected:', e.detail.date);
});
```

### Theming
- Built-in: `theme: 'dark' | 'light' | 'auto'` (auto follows system setting)
- Override colors on the host with CSS variables or via `palette`
```html
<div id="picker" style="--tg-background:#101524; --tg-text:#e6f0ff; --tg-accent:#66a3ff; --tg-track:#1b2750; --tg-thumb:#e6f0ff;"></div>
<script>
  const tg = new TimeGlide({ container: '#picker', theme: 'dark', palette: { accent: '#0ea5e9' } });
  tg.setTheme('light');
</script>
```

## Performance Advantages

| Action | Traditional Calendar | TimeGlide |
|--------|---------------------|-----------|
| Select date 10 years ago | 120+ clicks | 1 drag |
| Select birth date (1985) | 400+ clicks | 1 drag + 1 click |
| Jump to today | 2-3 clicks | 1 click/'T' key |
| Fine-tune by day | Navigate grid | Hold button |
| See year context | Switch views | Always visible |

## Customization

### CSS Variables
```css
:root {
  --tg-background: #1a1a1a;
  --tg-text: #ffffff;
  --tg-accent: #ff3333;
  --tg-track: #2a2a2a;
  --tg-thumb: #ffffff;
}
```

### Configuration Options
```javascript
{
  startYear: 1900,        // Range start
  endYear: 2050,          // Range end  
  defaultToToday: true,   // Start at today's date
  showTodayMarker: true,  // Show red today indicator
  enableKeyboard: true,   // Keyboard shortcuts
  smoothDrag: true,       // 60fps dragging
  accelerationDelay: 300, // Hold delay for acceleration (ms)
  theme: 'dark',          // 'dark' | 'light' | 'auto'
  palette: {              // Optional theme overrides
    accent: '#ff3333'
  }
}
```

## Use Cases

Perfect for:
- **Forms** - Birth date selection
- **Scheduling** - Event planning across years
- **Analytics** - Date range filtering
- **Historical Data** - Museum/archive interfaces
- **Financial** - Transaction date selection
- **Registration** - Age verification

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | 14+ |
| Chrome Mobile | 90+ |

## Technical Specs

- **Zero Dependencies** - Pure vanilla JavaScript
- **Lightweight** - Only 8KB minified
- **Accessible** - ARIA labels and keyboard navigation
- **GPU Accelerated** - Uses CSS transforms for smooth animations
- **Touch Optimized** - Full touch/swipe support

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone the repo
git clone https://github.com/yourusername/timeglide.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## License

MIT License

Copyright (c) 2025 TimeGlide contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Acknowledgments

- Inspired by the need for faster date selection in data-heavy applications
- Built with performance and minimalism as core principles
- Special thanks to all contributors

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/timeglide/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/timeglide/discussions)
- **Email**: support@timeglide.dev

## Builds
- UMD: `dist/timglide.umd.js` (global `TimeGlide`)
- ESM: `dist/timglide.esm.js` (default export)
- Types: `types/timglide.d.ts`

---

<p align="center">
  Made for developers who value speed and simplicity
</p>

<p align="center">
  <a href="#timeglide">Back to top</a>
</p>
### ES Module
```html
<script type="module">
  import TimeGlide from './dist/timglide.esm.js';
  const tg = new TimeGlide({ container: '#picker', theme: 'light' });
</script>
```
