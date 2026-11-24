# AURELIA® — Private Championship Golf Sanctuary & Performance Lab

An editorial, motion-driven web experience for **AURELIA®**, an ultra-private $100M coastal championship golf sanctuary, Tour-grade biomechanics performance lab, and architectural clubhouse estate.

## Tech Stack
- **React 19** + **TypeScript** + **Vite**
- **Framer Motion** (`useScroll`, `useTransform`, `useSpring`, `AnimatePresence`, `MotionConfig reducedMotion="user"`)
- **Lucide React** + bespoke inline SVG marks
- **Design System**: CSS custom properties (`src/styles/tokens.css`) with zero-flash dark base (`#070A08`), editorial grain overlay, and `Cormorant Garamond` / `Plus Jakarta Sans` / `JetBrains Mono` typography.

## Local Development
```bash
npm install
npm run dev
```

## Production Build & Lint
```bash
npm run lint
npm run build
```

## Vercel Deployment
Configured for zero-config deployment via [`vercel.json`](./vercel.json):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Edge Optimizations**: Immutable 1-year `Cache-Control` headers for `/assets/*` and `/images/*`, SPA fallback rewrites, and security headers.

See [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md) for the full design & motion specification.
