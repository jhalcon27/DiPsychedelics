# Sri Yantra — Interactive POC

**DiPsychedelics.com** · Sacred Geometry Series

A standalone interactive visualization of the Sri Yantra, built as a Proof of Concept for integration into [digitalpsychedelics.com](https://www.digitalpsychedelics.com).

---

## What It Does

The Sri Yantra is constructed step-by-step before the viewer's eyes:

1. **Bindu** — the central point appears with a glow flash
2. **9 Triangles** — each triangle fades in sequentially, with a brief glow on appearance
3. **Lotus Petals** — 8 inner + 16 outer petals bloom outward
4. **Bhupura** — the square earth-frame with four cardinal gates completes the figure
5. **Breathing mode** — once complete, the yantra enters a subtle meditative pulse (scale + micro-rotation)

**Mouse interaction**: hovering over the yantra creates a subtle parallax shift of the triangle layer.

---

## Files

```
sri-yantra-poc/
├── index.html       — Standalone page (open directly in browser)
├── sri-yantra.js    — Construction engine + animation + controls
├── sri-yantra.css   — Styles matching DiPsychedelics cyber aesthetic
└── README.md        — This file
```

---

## How to Run

No build step required. Just open `index.html` in any modern browser:

```bash
open /Users/Shared/GitHub/DiPsychedelics/sri-yantra-poc/index.html
```

Or serve locally:

```bash
cd /Users/Shared/GitHub/DiPsychedelics/sri-yantra-poc
npx serve .
# → http://localhost:3000
```

---

## Controls

| Control | Description |
|---------|-------------|
| **Auto-Build** | Animates the full construction sequence automatically |
| **Step →** | Advance one construction step at a time (manual mode) |
| **Reset** | Return to the beginning (bindu only) |
| **Speed** | Slider: controls delay between auto-build steps (fast ↔ slow) |
| **Breathe** | Toggle meditative breathing animation (scale pulse + micro-rotation) |
| **Theme / Cycle** | Cycle through 4 colour themes: Cyber, Gold, Silver, Emerald |

---

## Implementation Notes

### Technology Choice: SVG + Vanilla JS

The Flower of Life uses **p5.js** (canvas-based). For the Sri Yantra, **SVG** was chosen instead because:

- The Sri Yantra is entirely composed of straight lines and simple curves — SVG is vector-perfect at any resolution
- SVG elements are individually addressable (each triangle is a `<polygon>`) — ideal for step-by-step reveal
- No external dependencies — the entire engine is ~400 lines of vanilla JS
- Easier to embed in Astro as a component (just drop the `<svg>` or load the script)

### Geometry

The 9 triangles are defined using **polar coordinates** from the center:

```js
// Upward triangle (Shiva): apex at top, base at bottom
polarTriangle([0, 0.22], [120, 0.55], [240, 0.55])
// → apex at angle 0° (top), radius 0.22 from center
// → base vertices at ±120°, radius 0.55
```

All coordinates are normalised to a unit circle (radius = 1), then scaled to the SVG viewport. This makes the geometry resolution-independent and easy to resize.

The proportions are based on classical Sri Yantra geometry (Kamadhenu tradition), where:
- 4 upward triangles (Shiva) and 5 downward triangles (Shakti)
- Triangles are ordered innermost → outermost
- The outermost triangles nearly touch the circumscribed circle

### Animation

- **Fade-in**: CSS `opacity` transitions via `requestAnimationFrame` double-buffering
- **Breathing**: `requestAnimationFrame` loop applying `scale()` + `rotate()` SVG transforms
- **Parallax**: `mousemove` event shifts the triangle layer by ±4px relative to cursor position
- **Glow flash**: SVG `filter: url(#glow)` applied briefly on each new triangle, then removed

### Themes

4 colour themes, all applied via JS attribute manipulation on SVG elements:

| Theme | Primary | Secondary |
|-------|---------|-----------|
| Cyber | `#00f0ff` (cyan) | `#b44aff` (purple) |
| Gold | `#ffd700` | `#ff6b35` |
| Silver | `#e8e8f0` | `#8888aa` |
| Emerald | `#00ff88` | `#00b8c4` |

---

## Astro Integration

To embed in the DiPsychedelics Astro site:

### Option A — New page (recommended)

1. Copy `sri-yantra.js` → `site/public/sri-yantra.js`
2. Create `site/src/pages/sri-yantra.astro` using the `Layout` component
3. Copy the canvas section HTML into the Astro page
4. Add `<script src="/sri-yantra.js"></script>` at the bottom (outside the frontmatter)

### Option B — Component

1. Create `site/src/components/SriYantra.astro`
2. Inline the JS as `<script is:inline>` (paste the IIFE content)
3. Use `<SriYantra />` in any page

### Option C — Interactive page (like Flower of Life)

Mirror the structure of `how-the-world-is-made.astro`:
- Use the same `Layout` wrapper
- Replace the p5.js canvas with the SVG container
- Load `sri-yantra.js` via `<script src="...">` tag at the bottom of the page

---

## Known Limitations (POC)

- **Triangle proportions**: The 9 triangles use analytically-derived proportions that produce a visually correct Sri Yantra. For a mathematically exact Sri Yantra (where all intersection points are perfectly aligned), a constraint-solving approach would be needed. The visual result is indistinguishable from the exact version at normal viewing sizes.
- **No touch/mobile gestures**: The parallax effect uses `mousemove` only. Touch parallax could be added for mobile.
- **Step-back**: The "step back" function replays all previous steps instantly (no animation). This is intentional for simplicity.

---

## Next Steps for Full Integration

- [ ] Add to `llms.txt` and `ai.json` as a new interactive page
- [ ] Add i18n strings (de/es translations for labels and descriptions)
- [ ] Add to the site navigation and homepage featured section
- [ ] Consider adding a "meditation mode" — full-screen, no controls, breathing animation only
- [ ] Consider adding intersection point markers that flash as each triangle is added
