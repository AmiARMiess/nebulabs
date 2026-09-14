# NEBULABS — Ship Ideas at Light Speed 🌌

> One console for your whole galaxy.

**NEBULABS** is a dependency-free SaaS landing page for a fictional edge-deploy
platform. Its background is a living deep-space scene: **pure-CSS nebula
clouds** (three blurred, drifting gradient blobs) under a **Canvas 2D
starfield** with twinkling parallax stars and occasional shooting stars —
no WebGL, no libraries, no build step.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![Build](https://img.shields.io/badge/build-not%20required-brightgreen.svg)]()

<img width="1349" height="3927" alt="image" src="https://github.com/user-attachments/assets/16c4d486-34ee-494a-807a-d9def3f2ebdc" />

---

## ✨ Features

- 🌫️ **CSS nebula clouds** — three blurred radial gradients with
  `mix-blend-mode: screen`, drifting on independent loops forever
- ⭐ **Canvas starfield** — 240 twinkling stars with per-star depth, slow
  drift and mouse parallax
- ☄️ **Shooting stars** — randomly spawned gradient trails, additive blending
- 🖥️ **Terminal mock** — fake `nebulabs deploy` session with blinking cursor
- 🔢 **Count-up stats** — 99.99% uptime · 40ms p95 · 12k teams
- 💳 **Pricing tiers** — Starter / Pro (gradient-border highlight) / Enterprise
- 👀 **Scroll reveals** — gated behind `html.js`, so content never hides if
  scripts are blocked
- ♿ **Reduced-motion aware** — nebula, pulses and reveals all calm down
- 📴 **Offline-ready** — works from `file://` in any modern browser

## 🚀 Quick Start

```bash
git clone https://github.com/AmiARMiess/nebulabs.git
cd nebulabs
open index.html        # double-click works — no server needed
```

Fonts (Space Grotesk + Inter) load from Google Fonts when online and fall
back to system sans offline. Everything else is fully local.

## 📁 Structure

```
nebulabs/
├── index.html     # sections: hero, features, console, quote, pricing, CTA
├── style.css      # tokens, nebula layer, glass cards, terminal, animations
├── script.js      # starfield engine + watchdog, reveals, counters, parallax
├── README.md      # this file
└── .gitattributes # line-ending + linguist rules
```

## 🧩 Sections

| Section  | Content                                             |
|----------|-----------------------------------------------------|
| Hero     | Version badge, giant headline, count-up stats row   |
| Features | 6 glass cards — deploys, sync, observability, CI…   |
| Console  | Checklist + animated terminal deploy mock           |
| Quote    | Full-width customer testimonial with gradient accent|
| Pricing  | 3 tiers with gradient-border "Most popular" plan    |
| CTA      | Glass panel with dual buttons                       |
| Footer   | Auto year + status/docs/security links              |

## 🎨 Theming

All tokens live in `:root` of `style.css`:

```css
:root{
  --space:#05030F;   /* deep space black-violet */
  --ink:#EDEBFF;     /* starlight white         */
  --v:#8B7BFF;       /* nebula violet           */
  --m:#FF6EC7;       /* nebula magenta          */
  --c:#4FD8EB;       /* nebula cyan             */
  --grad:linear-gradient(110deg,var(--v),var(--m) 55%,var(--c));
}
```

Swap the three nebula colors and every gradient, glow, highlight, pricing
border and star tint follows automatically.

## 🛡️ Graceful Degradation

1. **JS blocked** → reveals never hide content (`html.js` gate); the CSS
   nebula keeps animating and the page stays complete.
2. **Canvas unavailable** → starfield init exits silently; nebula remains.
3. **Loop stalled** → a 400 ms watchdog re-arms `requestAnimationFrame`
   after tab switches, sleep or browser throttling.
4. **No IntersectionObserver** → reveals and counters resolve instantly.
5. **Reduced motion** → drift, pulses and reveals freeze gracefully.

## ⚙️ Performance

- Zero network requests except optional fonts
- All motion is compositor-friendly (transform / opacity / filter on fixed layers)
- Parallax writes two CSS variables on `mousemove` (passive listener)
- ~150 lines of vanilla JS, fully wrapped in `try/catch`

## 🧑 Browser Support

Any modern browser (Chrome, Edge, Firefox, Safari), including older builds —
no WebGL, no modules, no polyfills.

## 📄 License

MIT — free for personal and commercial use.

---

*Your galaxy is waiting.*
