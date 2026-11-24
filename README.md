# AURELIA® — Private Championship Golf Sanctuary, Cinema & Performance Lab

An editorial, video-motion-driven flagship web application for **AURELIA®**, an ultra-private $100M USD coastal championship golf sanctuary, 1,000-fps Tour biomechanics performance lab, and board-formed concrete clubhouse estate on the Monterey Peninsula.

## Highlights & Video Motion Architecture
- **Act 0 — Liquid-Glass Navigation (`Navbar.tsx`)**: Bespoke SVG flag-in-compass crest, spring-physics `layoutId` sliding capsule, live Monterey telemetry (`12.5 STIMP · 9 KT WNW`), magnetic CTA, and accessible mobile glass drawer.
- **Act I — Full-Bleed Twilight Video Hero (`HeroSection.tsx`)**: Muted H.264 `+faststart` coastal links loop (`/videos/hero-links.mp4`) with `1.8s` `scale(1.06 -> 1)` settle, scroll parallax, 8-stop non-banding obsidian scrim, progressive depth-of-field bottom blur, `IntersectionObserver` off-screen pause, WCAG 2.2 motion pause toggle, and anamorphic showreel trigger.
- **Act II — Scroll-Illuminated Philosophy (`ManifestoSection.tsx`)**: Word-by-word scroll-linked opacity/color reveal (`#3A423D -> #F3EFE6`).
- **Act III — Scroll-Scrubbed Aerial Flyover (`SignatureHoleStage.tsx`)**: `285vh` sticky stage scrubbing `/videos/aerial-scrub.mp4` (`GOP=2` + pre-decoded `<canvas>` frame cache + `0.14` rAF lerp) through parting Pacific sea fog onto the 18th peninsula Par-3 green with synchronized HUD telemetry callouts.
- **Act IV — Crossfading Multi-Video Estate Anthology (`CinemaReelSection.tsx` & `EstateFilmModal.tsx`)**: 3-chapter crossfading video switcher (*Coastal Links*, *1,000-FPS Impact Forge*, *Dusk at the Monolith*), fullscreen `2.39:1` theatre modal, and pure Web Audio API synthesized Pacific surf & sanctuary harmonic pad.
- **Act V — Sticky-Stacking Estate Pillars (`PillarsSection.tsx`)**: 3D-scaled sticky cards with hover-to-play live video previews and interactive dossier modals.
- **Act VI & VII — Radar Ballistics & Founding Patronage (`TelemetrySection.tsx`, `PatronageSection.tsx`, `InquiryModal.tsx`)**: Interactive club trajectory simulator (`pathLength` SVG arc), easeOutExpo patronage counters, and spring-chip confidential inquiry modal.

## Tech Stack & Design Skills
- **React 19** + **TypeScript 7** + **Vite 8**
- **Framer Motion** (`MotionConfig reducedMotion="user"`, `useScroll`, `useTransform`, `useSpring`, `AnimatePresence`, `layoutId`)
- **Lucide React** + bespoke inline SVG crests & rangefinder reticles
- Crafted with **MotionSites Web Builder**, **UI/UX Pro Max**, and **Cinematic UI/UX** principles (see [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md)).

## Local Development
```bash
npm install
npm run dev
```

## Lint & Production Build
```bash
npm run lint
npm run build
```

## Vercel Deployment
Optimized via [`vercel.json`](./vercel.json) and [`vite.config.ts`](./vite.config.ts):
- **Framework Preset**: Vite (`dist` output)
- **Bundle Splitting**: Dedicated `vendor-react`, `vendor-motion`, and `vendor-icons` chunks
- **Edge Caching**: Immutable 1-year `Cache-Control` headers for `/assets/*`, `/images/*`, and `/videos/*`
- **Routing & Security**: Static-asset-safe SPA fallback rewrite (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
