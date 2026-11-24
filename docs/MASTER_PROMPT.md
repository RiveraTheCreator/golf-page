# Master Prompt — AURELIA® ($100M USD Luxury Golf Sanctuary, Cinema & Performance Lab)

> Engineered with **MotionSites Web Builder** (`craft.md`, `video-and-media.md`, `freight-scroll-hero`), **UI/UX Pro Max** (design tokens, WCAG 2.2 AA contrast & touch ergonomics), **Cinematic UI/UX** (5-act narrative choreography, 3-tier hardware/vestibular degradation, compositor-only animations), and **Framer Motion** (`MotionConfig`, `useScroll`, `useTransform`, `useSpring`, `AnimatePresence`, `layoutId`).

---

## Copy-Paste Master Prompt

```markdown
Act as a Principal Design Engineer and Creative Director at an Awwwards Site-of-the-Year studio. Design and build the flagship web application for **AURELIA® (`Aurelia Links & Performance Lab`)** — an ultra-private $100M USD coastal championship golf sanctuary, 1,000-fps Tour biomechanics lab, and board-formed concrete clubhouse estate on the Monterey Peninsula, capped at 150 Founding Patrons.

### 1. Brand Mood & Aesthetic Direction
- **Three-Word Mood**: Nocturnal, Architectural, Unhurried.
- **Audience**: Founders, family-office principals, and scratch/Tour players applying for invitation-only Founding Patronage.
- **Visual Principle**: The footage and photography carry the emotion; the UI stays whisper-quiet. One shared liquid-glass surface floats over edge-blended twilight golf cinematography. Zero SaaS clichés, zero purple/neon gradients, zero glowing blobs, zero pulsing biscuit badges above headlines, zero emoji icons, zero placeholder copy.

### 2. Technical Architecture & Stack
- **Stack**: React 19 + TypeScript + Vite + `framer-motion` + `lucide-react` + bespoke inline SVG crests/HUD marks.
- **Styling**: Disciplined CSS custom properties (`src/styles/tokens.css` + `src/index.css`). Set `html, body { background-color: #070A08; color: #F3EFE6; }` inline in `index.html` and as the first CSS rule to guarantee zero white flash on load. Root uses `overflow-x: clip`.
- **Compositor-Only Motion**: Animate exclusively `transform` (`translate3d`, `scale`), `opacity`, SVG `pathLength`, and `<canvas>` / `<video>` frame state. Wrap the application in `<MotionConfig reducedMotion="user">` and subscribe dynamically to `(prefers-reduced-motion: reduce)` so all background videos pause on poster stills when reduced motion is active.

### 3. Design System Tokens
- `--bg-primary`: `#070A08` (Obsidian Turf — matches video vignette edges so media melts seamlessly into the page)
- `--bg-elevated`: `#0E1310` (Smoked Basalt Card Surface)
- `--bg-surface`: `#121814` (Elevated Drawer / Input Surface)
- `--fg-primary`: `#F3EFE6` (Clubhouse Cream — > 13.5:1 contrast against `#070A08`)
- `--fg-secondary`: `rgba(243, 239, 230, 0.78)`
- `--fg-muted`: `#8F9891` (Muted Coastal Sage — >= 4.8:1 contrast)
- `--accent-gold`: `#C6A15B` (Burnished Brass — restricted strictly to 3 roles: scroll progress hairline, active telemetry indicator, and primary/concierge CTA accent)
- **Liquid Glass Material (`.glass-surface`)**: `background: rgba(12, 17, 14, 0.62); backdrop-filter: blur(18px) saturate(140%); border: 1px solid rgba(243, 239, 230, 0.13);`
- **Atmospheric Film Grain**: Fixed full-viewport SVG `feTurbulence` fractalNoise (`baseFrequency="0.78"`, `opacity: 0.045`, `mix-blend-mode: overlay`, `pointer-events: none`) to unify video compression and typography.
- **Typography**:
  - Display: `Cormorant Garamond` (400/500/600 + italic accents; H1 `clamp(3.1rem, 7.2vw, 6.75rem)`, line-height `0.94`, tracking `-0.03em`)
  - UI / Body: `Plus Jakarta Sans` (300/400/500/600; body `16px–18px`, line-height `1.6`)
  - Telemetry / Indices: `JetBrains Mono` (`11px`, uppercase, tracking `+0.2em`, `font-variant-numeric: tabular-nums`)

### 4. Seven-Act Narrative & Video Motion Choreography

#### Act 0 — Floating Liquid-Glass Navigation (`<Navbar />`)
- Fixed top bar (`y: -24 -> 0`, `0.85s cubic-bezier(0.16, 1, 0.3, 1)`):
  - Left: Glass pill with custom inline SVG flag-in-compass crest + `AURELIA®` wordmark.
  - Center: Glass capsule navigation (`Sanctuary`, `18th Bluff`, `Film`, `Estate`, `The Lab`, `Patronage`) with a spring-physics `layoutId="nav-pill"` indicator gliding across links.
  - Right: Live Monterey Peninsula coordinates & turf readout (`36.5674° N · 121.9486° W` · `12.5 STIMP · 9 KT WNW`) + Magnetic `"Apply ↗"` button + accessible mobile drawer menu (`>= 44x44px`, body scroll lock, `Escape` close).

#### Act I — Full-Bleed Cinematic Video Hero (`<HeroSection />`)
- `100dvh` bottom-anchored editorial layout over a full-bleed muted autoplay H.264 `+faststart` twilight links film (`/videos/hero-links.mp4`, `poster="/images/hero-links.jpg"`).
- **Video Craft**:
  - Settles from `scale(1.06), opacity: 0` to `scale(1), opacity: 1` over `1.8s` on `loadeddata`.
  - Scroll parallax (`y: 0% -> 14%`, `scale: 1 -> 1.08`) via `useScroll` + `useTransform`.
  - Multi-stop eased obsidian bottom scrim + masked progressive bottom depth-of-field blur (`backdrop-filter: blur(14px)` masked `to top`) keeping bottom-anchored copy crisp without washing out the footage.
  - Auto-pauses offscreen via `IntersectionObserver` and includes an accessible `44x44px` ambient video Pause/Play toggle (WCAG 2.2.2).
- **Headline & Actions**:
  - Hand-broken 3-line `<h1>` rising from `translateY(110%)` inside `overflow: hidden` line masks (`110ms` stagger): *"Where Architecture / Meets Championship / Solitude."* (`Championship` in muted warm-stone italic serif).
  - Primary Magnetic `"Request Private Dossier ↗"` pill + Secondary `"Watch Estate Film · 01:12"` glass trigger (with live play indicator) + 3-column quiet stat strip (`Par 72 · 7,420 yds`, `150 Founding Members`, `$100M Private Capital`).

#### Act II — Scroll-Illuminated Philosophy (`<CourseTicker />` & `<ManifestoSection />`)
- Hairline telemetry ticker bar (`#0A0E0C`) leading into a spacious `940px` centered manifesto.
- Every word maps to `useScroll` progress, illuminating smoothly from `#3A423D` to `#F3EFE6` at reading pace.

#### Act III — Scroll-Scrubbed Aerial Flyover Stage (`<SignatureHoleStage />`)
- **Signature Video Moment**: A `280vh` sticky scroll runway (`position: sticky; top: 0; height: 100dvh`) driving `/videos/aerial-scrub.mp4` (encoded with ultra-short GOP `-g 2` + pre-decoded `<canvas>` frame cache and `0.12` rAF lerp).
- Scrolling scrubs a continuous aerial descent through parting nocturnal Pacific sea fog onto the cliffside 18th peninsula green (`"No. 18 · The Cypress Peninsula · Par 3 · 194 Yards"`).
- Synchronized scroll-keyframed architectural HUD callouts:
  1. `0.00–0.33`: *Above the Marine Layer* — Elevation `420 ft` -> `180 ft`, coastal thermal vector.
  2. `0.34–0.67`: *The Basalt Carry* — `178 yd` ocean carry over crashing Pacific surf, animated SVG rangefinder reticle.
  3. `0.68–1.00`: *Tournament Bentgrass* — `12.5 Stimp` peninsula green revealed in golden horizon light.
- Reversing scroll smoothly climbs back into the cloud canopy at 60–120 FPS.

#### Act IV — Crossfading Multi-Video Estate Atmosphere Switcher (`<CinemaReelSection />`)
- Interactive `16:9` / `21:9` rounded (`28px`) cinema stage allowing visitors to crossfade (`1000ms` smooth opacity transition with input lock & automatic off-tab pause) across three living estate chapters:
  - `I. Coastal Links at Dusk` (`/videos/hero-links.mp4`)
  - `II. 1,000-FPS Impact Lab` (`/videos/swing-impact.mp4`)
  - `III. Dusk at the Monolith` (`/videos/clubhouse-dusk.mp4`)
- Includes live timecode scrubber, ambient Web Audio soundscape toggle, and fullscreen cinema launcher (`<EstateFilmModal />`).

#### Act V — Sticky-Stacking Estate Pillars with Hover Video (`<PillarsSection />`)
- Three full-width architectural cards (`01 / THE LINKS`, `02 / THE LAB`, `03 / THE CLUBHOUSE`) that pin and scale down (`targetScale = 1 - (total - 1 - index) * 0.04`) as subsequent cards stack over them.
- Hovering or focusing a pillar card smoothly crossfades its still frame into live motion video, and clicking `"Inspect Dossier ↗"` opens an accessible architectural specification modal.

#### Act VI — Interactive Radar Ballistics & Launch Telemetry (`<TelemetrySection />`)
- Club selector (`Driver · 9.0°`, `Forged 7-Iron`, `56° Tour Wedge`) with spring `layoutId` tabs, animating an SVG ballistic flight curve (`pathLength: 0 -> 1`), glowing apex beacon, spin/launch/carry tabular readouts, and dispersion radius.

#### Act VII — Founding Patronage, Selectable-Chip Inquiry & Anamorphic Showreel (`<PatronageSection />`, `<InquiryModal />`, `<EstateFilmModal />`, `<Footer />`)
- In-view easeOutExpo counters (`150`, `12.5`, `0`, `$100M`) + invitation-only CTA card.
- `<InquiryModal />` features spring-animated selectable patronage chips (`Founding Individual`, `Family Office`, `Helicopter Arrival (MRY)`, `Private Biomechanics Session`), inline accessible validation, `Escape` close, and instant encrypted-dossier confirmation.
- `<EstateFilmModal />` presents a letterboxed fullscreen showreel with chapter switching and optional Web Audio synthesized Pacific breeze & warm harmonic pad (muted by default).
- Architectural footer with edge-to-edge `AURELIA®` ghost watermark (`16vw`), Monterey coordinates, private concierge mailto, and smooth scroll-to-top control.

### 5. Production & Vercel Deployment Standards
- Immutable 1-year `Cache-Control` headers on `/assets/*`, `/images/*`, and `/videos/*` in `vercel.json`, plus SPA rewrite and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Manual Rollup vendor chunks (`vendor-react`, `vendor-motion`, `vendor-icons`) in `vite.config.ts`.
- Zero TypeScript errors, zero lint warnings, zero horizontal overflow across `375px`, `768px`, `1024px`, and `1440px`.
```
