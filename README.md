# AyurSense Web App

Clinical decision-support UI for **AyurSense**, powered by **AyurGenix V9** on Hugging Face (IndicBERTv2 + LoRA). For research and educational use only — not a substitute for professional medical advice.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Route | Purpose |
|-------|---------|
| `/` | Marketing home: hero → three steps → capability teaser → quote → CTA |
| `/intake` | Patient intake (2-step) + clinical report |
| `/journey` | Full scroll-based clinical journey (optional deep dive) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint |
| `npm run a11y` | axe-core CLI on `/`, `/journey`, `/intake` (preview on port 4173) |
| `npm run a11y:setup` | Sync ChromeDriver with installed Chrome |

### Accessibility audit

```bash
npm run build
npm run preview
# In another terminal:
npm run a11y
```

If ChromeDriver mismatches your Chrome version:

```bash
npx browser-driver-manager install chrome
npm run a11y
```

Manual checks: keyboard Tab through header, intake stepper, and report export; screen reader (NVDA / VoiceOver) on intake steps and report sections.

## Design system

### When to use which card

| Pattern | Class / component | Use for |
|---------|-------------------|---------|
| **Dark stat card** | `.stat-card`, `.report-metric` | Hero metrics, report KPIs (dosha, severity, safety). Dark gradient background, light text. |
| **White surface card** | `.how-it-works__card`, `.report-interaction`, `.path-card`, intake shell | Readable body content, forms, interaction details, journey articles. White/`cloud-gray` with `light-steel` border. |
| **Pill CTA** | `.btn-primary`, `.btn-secondary` | Primary actions (intake, submit). Min height 44px, full radius. |
| **Disclaimer** | `MedicalDisclaimer` | Legal + privacy copy below forms and reports. |

### Design tokens

| Token | Value | Usage |
|-------|-------|--------|
| `--color-inkwell` | `#000000` | Primary text |
| `--color-canvas` | `#ffffff` | Page background |
| `--color-deep-graphite` | `#171717` | Primary buttons, dark UI |
| `--color-cloud-gray` | `#f8f8f8` | Subtle fills, section backgrounds |
| `--color-dark-stone` | `#515151` | Secondary text (AA on white) |
| `--color-ash-stone` | `#979797` | Decorative borders only (not body text) |
| `--color-light-steel` | `#cfcfcf` | Borders |
| `--color-safe-green` | `#16a34a` | OK / synergistic |
| `--color-warn-amber` | `#d97706` | Caution |
| `--color-crimson-hue` | `#ff2600` | Danger / errors |
| `--gradient-ayur` | brand gradient | Accent text, active step dots |
| `--radius-sm` | `8px` | Cards, panels |
| `--radius-full` | pill | Buttons |
| `--text-body` / `--leading-body` | `16px` / `1.6` | Body copy |
| `--section-gap` | `64px` | Major section rhythm |

Typography: **Outfit** (display/headings), **Inter** (UI/body), **Space Mono** (data labels).

### Imagery

Place optimized WebP files under `public/images/` (see `public/images/README.md`). Until then, capability and journey images use curated Unsplash fallbacks via `src/data/media.js`.

## Stack

React 19, Vite 8, React Router 7, Tailwind CSS 4, GSAP + Lenis, `@gradio/client` for inference.
