# Master Prompt — AURELIA® ($100M USD Luxury Golf Sanctuary & Performance Lab)

> Synthesized from **UI/UX Pro Max** (accessibility, design tokens, hierarchy), **MotionSites Craft** (editorial composition, scroll choreography, grain, masked typography), and **Framer Motion** (`useScroll`, `useTransform`, `useSpring`, magnetic interactions).

---

## Role & Objective
Act as a Principal Design Engineer and Creative Director at an Awwwards-winning studio. Build a flagship web application for **AURELIA® (`Aurelia Links & Performance Lab`)** — an ultra-private, $100M+ coastal championship golf sanctuary, Tour-grade biomechanics & launch-monitor performance lab, and architectural clubhouse estate.

The site must feel **calm, expensive, nocturnal, and tactile** — engineered for founders, Tour players, and private equity principals applying for Founding Patronage.

---

## Technical Stack & Non-Negotiables
- **Framework**: React 19 + TypeScript + Vite
- **Motion**: `framer-motion` (`useScroll`, `useTransform`, `useSpring`, `useInView`, `AnimatePresence`, `MotionConfig reducedMotion="user"`)
- **Icons**: `lucide-react` + bespoke inline SVG crests/marks (zero emoji icons)
- **Styling**: Pure, disciplined CSS custom properties (`tokens.css` + modular CSS) — zero utility bloat, zero white flash (`html, body { background: #070A08; }` as the very first CSS rule), `overflow-x: clip` on root.
- **Fonts**: `Cormorant Garamond` (editorial high-contrast serif display, weights 400/500/600, italic accents) + `Plus Jakarta Sans` (neutral grotesk UI/body, weights 300/400/500/600) + `JetBrains Mono` (micro-labels, coordinates, telemetry indices).

---

## Design System & Color Discipline
- **Obsidian Turf (`--bg-primary`)**: `#070A08` (matches media edge colors so photography melts seamlessly)
- **Elevated Slate (`--bg-elevated`)**: `#0E1310`
- **Clubhouse Cream (`--fg-primary`)**: `#F3EFE6` (high-contrast warm ivory, > 13:1 on obsidian)
- **Muted Sage-Stone (`--fg-muted`)**: `#8F9891`
- **Burnished Brass (`--accent-gold`)**: `#C6A15B` (used with extreme restraint: primary hairline glyph, active telemetry dot, subtle CTA border/fill)
- **Deep Augusta Emerald (`--accent-emerald`)**: `#1B4332`
- **Glass Material (reused everywhere)**: `rgba(14, 19, 16, 0.58)` with `backdrop-filter: blur(18px) saturate(140%)` and `1px solid rgba(243, 239, 230, 0.12)`
- **Atmospheric Grain**: Fixed SVG `feTurbulence` fractal-noise overlay at `0.045` opacity (`pointer-events: none`) unifying photography and UI.
- **Forbidden**: No purple/indigo gradients, no glowing neon orbs, no grid-line backgrounds, no pulsing biscuit pills above H1, no emoji icons, no Lorem Ipsum.

---

## Section Architecture & Motion Choreography

### 0. Floating Glass Navigation (`<Navbar />`)
- Single-row pill bar at top (`height: 52px`), centered or split: left `AURELIA®` bespoke SVG crest + wordmark; center sliding-pill nav (`Sanctuary`, `The Lab`, `Course`, `Membership`) where an animated `layoutId="nav-pill"` glides smoothly between hovered/active items; right magnetic `"Apply for Patronage ↗"` CTA pill.
- Live micro-telemetry on desktop: `36.5674° N, 121.9486° W · MONTEREY` + live local course condition (`11.8 STIMP · 9 KT WNW`).

### 1. Editorial Hero (`<HeroSection />`)
- **Viewport**: `100dvh`, bottom-anchored editorial composition.
- **Media**: Full-bleed twilight coastal links photography (`/images/hero-links.jpg`) with subtle scroll parallax (`y: 0 -> 12%`) and initial settle (`scale: 1.07 -> 1`, `opacity: 0 -> 1` over `1.6s`, `cubic-bezier(0.16, 1, 0.3, 1)`). Top and bottom radial/linear vignettes melt edges into `#070A08`.
- **Typography**: Hand-broken 3-line display `<h1>` (`clamp(3.2rem, 6.8vw, 6.5rem)`, line-height `0.94`, tracking `-0.03em`):
  - Line 1: `Where Architecture`
  - Line 2: `Meets` *`Championship`* (italic serif in muted warm stone)
  - Line 3: `Solitude.`
  - Each line rises from `translateY(110%)` inside `overflow: hidden` masks, staggered `110ms`.
- **Bottom Bar**: Left 2-line editorial subcopy (`max-width: 34rem`); Right magnetic `"Request Private Dossier ↗"` pill button + secondary `"Explore 18 Holes"` ghost button, plus a quiet 3-stat strip (`18 Holes · 7,420 Yards`, `150 Founding Patrons`, `$100M Estate`).

### 2. Telemetry Ticker Bar (`<CourseTicker />`)
- Crisp `1px` top/bottom hairline bar (`#0A0E0C`): `EST. 2026` · `SCROLL TO EXPLORE ↓` · `TOUR-GRADE BIOMECHANICS`.

### 3. Scroll-Driven Manifesto (`<ManifestoSection />`)
- Centered `max-width: 900px`, generous `160px` vertical padding.
- Every word is wrapped in its own `<span>` driven by `useScroll({ target, offset: ['start 0.78', 'end 0.32'] })`: as the user scrolls, words smoothly illuminate from `#3A423D` to `#F3EFE6` in reading order.
- Copy: *"We believe great golf is not rushed through crowded tee sheets. Every contour, every bunker, and every millisecond of swing telemetry at Aurelia is engineered for players who measure legacy in precision."*

### 4. Sticky-Stacking Estate Pillars (`<PillarsSection />`)
- Three full-width architectural cards that **pin and scale down smoothly** (`targetScale = 1 - (total - 1 - index) * 0.04`) via `useScroll` + `useTransform` as the next card rises over them:
  - **01 / THE LINKS**: *Cliffside Championship Routing* — Par 72 · 7,420 Yards · Fescue & Bentgrass (`/images/par3-green.jpg`).
  - **02 / THE LAB**: *Tour Biomechanics & 3D Force Plates* — Dual-Radar Launch Telemetry & Custom Forging (`/images/perf-lab.jpg`).
  - **03 / THE CLUBHOUSE**: *Board-Formed Concrete & Private Cellar* — 14 Suites, Recovery Spa & Sommelier Vault (`/images/clubhouse-dusk.jpg`).
- Each card features an interactive hover zoom on its photography, crisp index metadata, and a clickable `"Inspect Dossier →"` action that opens a sleek slide-over detail drawer.

### 5. Interactive Swing & Shot Telemetry Preview (`<TelemetrySection />`)
- Interactive club selector (`Driver`, `7-Iron`, `56° Wedge`) that smoothly animates a custom SVG ballistic trajectory arc (`pathLength` 0 → 1 via Framer Motion) and live animated numbers (`Ball Speed`, `Launch Angle`, `Spin Rate`, `Carry`). Demonstrates the $100M Performance Lab's precision without dashboard clutter.

### 6. Patronage Metrics & Private Inquiry (`<PatronageSection />`)
- Animated count-up metrics (`150` Max Patrons, `12.5` Avg Stimp, `0` Tee-Time Bottlenecks, `$100M` Capital Endowment) triggered once on `useInView`.
- Interactive **Private Patronage Application Modal / Inline Form** with accessible validation, instant confirmation state, and zero layout shift.

### 7. Architectural Footer (`<Footer />`)
- Minimalist 4-corner editorial footer with giant `AURELIA®` ghost wordmark, Monterey coordinates, private concierge email, and back-to-top spring button.

---

## Acceptance Criteria
1. Zero white flash on load; zero horizontal overflow (`375px`, `768px`, `1024px`, `1440px`).
2. `MotionConfig reducedMotion="user"` wraps the entire app.
3. All interactive elements have `>= 44x44px` touch targets, `cursor: pointer`, visible `:focus-visible` rings, and `>= 4.5:1` contrast.
4. `npm run build` succeeds with zero TypeScript or Vite errors.
