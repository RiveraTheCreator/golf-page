import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, Wind } from 'lucide-react';
import { usePrefersReducedMotion } from './motion/motionHooks';

/**
 * Act III — Scroll-Scrubbed Aerial Flyover Stage (MotionSites Technique #7).
 * Scrubs `/videos/aerial-scrub.mp4` via a pre-decoded <canvas> frame cache +
 * short-GOP <video> seek fallback as the user scrolls down a 280vh sticky track,
 * descending through parting coastal sea fog onto the 18th peninsula Par-3 green.
 */
export function SignatureHoleStage() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [hasVideo, setHasVideo] = useState(false);
  const [hasFrames, setHasFrames] = useState(false);
  const [altitudeFt, setAltitudeFt] = useState(420);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Beat 1: High above the Pacific marine cloud deck (0.00 -> 0.34)
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.26, 0.36], [1, 1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.36], ['0px', '-28px']);

  // Beat 2: Parting clouds & basalt ocean carry telemetry (0.34 -> 0.68)
  const beat2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.60, 0.70], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.32, 0.45, 0.70], ['28px', '0px', '-24px']);

  // Beat 3: Locked onto the 18th peninsula green (0.68 -> 1.00)
  const beat3Opacity = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1]);
  const beat3Y = useTransform(scrollYProgress, [0.66, 0.80], ['28px', '0px']);

  // Reticle ring scale on green arrival
  const reticleOpacity = useTransform(scrollYProgress, [0.52, 0.74, 1], [0, 0.9, 0.95]);
  const reticleScale = useTransform(scrollYProgress, [0.52, 0.82], [1.45, 1]);

  useEffect(() => {
    if (prefersReduced) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!video || !canvas || !track) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;
    let smoothProgress = 0;
    let lastFrameIdx = -1;
    let cachedFrames: HTMLCanvasElement[] = [];

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastFrameIdx = -1;
    };

    const drawCover = (source: HTMLCanvasElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / source.width, ch / source.height);
      const dw = source.width * scale;
      const dh = source.height * scale;
      ctx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const computeRawProgress = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const seekHelper = (v: HTMLVideoElement, timeSec: number) =>
      new Promise<void>((resolve) => {
        const finish = () => {
          window.clearTimeout(timeout);
          resolve();
        };
        const timeout = window.setTimeout(finish, 650);
        v.addEventListener('seeked', finish, { once: true });
        v.currentTime = timeSec;
      });

    const extractFrameCache = async () => {
      const extractor = document.createElement('video');
      extractor.muted = true;
      extractor.playsInline = true;
      extractor.preload = 'auto';
      extractor.src = video.currentSrc || video.src;

      extractor.play().then(() => extractor.pause()).catch(() => {});
      if (extractor.readyState < 2) {
        await new Promise<void>((resolve) =>
          extractor.addEventListener('loadeddata', () => resolve(), { once: true })
        );
      }
      if (disposed || !extractor.duration || !extractor.videoWidth) return;

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const maxWidth = isMobile ? 640 : 960;
      const frameCount = isMobile ? 42 : 64;
      const scale = Math.min(1, maxWidth / extractor.videoWidth);
      const fw = Math.round(extractor.videoWidth * scale);
      const fh = Math.round(extractor.videoHeight * scale);
      const built: HTMLCanvasElement[] = [];

      for (let i = 0; i < frameCount; i++) {
        if (disposed) return;
        const targetTime = (i / (frameCount - 1)) * Math.max(0.1, extractor.duration - 0.05);
        await seekHelper(extractor, targetTime);
        const off = document.createElement('canvas');
        off.width = fw;
        off.height = fh;
        const offCtx = off.getContext('2d');
        offCtx?.drawImage(extractor, 0, 0, fw, fh);
        built.push(off);
      }

      if (!disposed && built.length > 0) {
        cachedFrames = built;
        lastFrameIdx = -1;
        setHasFrames(true);
      }
      extractor.removeAttribute('src');
      extractor.load();
    };

    let lastAltitudeDisplayed = 420;
    const tick = () => {
      if (disposed) return;
      const target = computeRawProgress();
      smoothProgress += (target - smoothProgress) * 0.14;

      const currentAlt = Math.round(420 - smoothProgress * 355);
      if (Math.abs(currentAlt - lastAltitudeDisplayed) >= 3) {
        lastAltitudeDisplayed = currentAlt;
        setAltitudeFt(currentAlt);
      }

      if (cachedFrames.length > 0) {
        const idx = Math.min(
          cachedFrames.length - 1,
          Math.max(0, Math.round(smoothProgress * (cachedFrames.length - 1)))
        );
        if (idx !== lastFrameIdx) {
          drawCover(cachedFrames[idx]);
          lastFrameIdx = idx;
        }
      } else if (video.readyState >= 1 && video.duration) {
        const targetTime = smoothProgress * Math.max(0.1, video.duration - 0.05);
        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.035) {
          video.currentTime = targetTime;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    video.muted = true;
    video.playsInline = true;
    video.play().then(() => video.pause()).catch(() => {});

    const onLoadedData = () => {
      if (disposed) return;
      setHasVideo(true);
      window.setTimeout(() => {
        if (!disposed) {
          void extractFrameCache();
        }
      }, 320);
    };

    if (video.readyState >= 2) {
      onLoadedData();
    } else {
      video.addEventListener('loadeddata', onLoadedData, { once: true });
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      video.removeEventListener('loadeddata', onLoadedData);
    };
  }, [prefersReduced]);

  // Reduced-motion fallback: static crisp vista + stacked telemetry cards
  if (prefersReduced) {
    return (
      <section
        id="bluff-stage"
        style={{
          paddingBlock: 'clamp(4.5rem, 9vw, 7.5rem)',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container-editorial">
          <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
            SIGNATURE HOLE · NO. 18 &ldquo;THE CYPRESS PENINSULA&rdquo;
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.25rem)',
              fontWeight: 400,
              margin: '0.75rem 0 2rem 0',
            }}
          >
            194 Yards Over Crashing Basalt Surf.
          </h2>
          <div
            style={{
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              border: '1px solid var(--border-strong)',
            }}
          >
            <img
              src="/images/aerial-18th.jpg"
              alt="Aerial view of Aurelia 18th peninsula green jutting into Pacific Ocean surf at twilight"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="bluff-stage"
      ref={trackRef}
      aria-label="Signature 18th Cliffside Peninsula Aerial Flyover"
      style={{
        position: 'relative',
        height: '285vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Sticky Full-Viewport Scrubbed Cinema Stage */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#070A08',
        }}
      >
        {/* Layer 1: High-res static aerial poster fallback */}
        <img
          src="/images/aerial-18th.jpg"
          alt="Aerial view of Aurelia 18th cliffside peninsula par-3 surrounded by Pacific surf"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hasVideo || hasFrames ? 0 : 1,
            transition: 'opacity 500ms ease',
          }}
        />

        {/* Layer 2: Short-GOP H.264 Scrubbed Video Fallback */}
        <video
          ref={videoRef}
          src="/videos/aerial-scrub.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hasVideo && !hasFrames ? 1 : 0,
            transition: 'opacity 450ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 3: Pre-decoded 60fps Canvas Frame Cache */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: hasFrames ? 1 : 0,
            transition: 'opacity 450ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Top & Bottom Obsidian Melts so stage merges invisibly with adjacent sections */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, #070A08 0%, rgba(7,10,8,0.28) 16%, rgba(7,10,8,0.12) 52%, rgba(7,10,8,0.62) 84%, #070A08 100%)',
          }}
        />

        {/* Center Architectural Target Reticle (reveals as clouds part over the green) */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '51%',
            x: '-50%',
            y: '-50%',
            opacity: reticleOpacity,
            scale: reticleScale,
            pointerEvents: 'none',
            zIndex: 4,
          }}
        >
          <svg width="168" height="168" viewBox="0 0 168 168" fill="none">
            <circle
              cx="84"
              cy="84"
              r="68"
              stroke="rgba(198, 161, 91, 0.42)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="84"
              cy="84"
              r="34"
              stroke="rgba(243, 239, 230, 0.35)"
              strokeWidth="0.75"
            />
            <circle cx="84" cy="84" r="3.5" fill="#C6A15B" />
            <line x1="84" y1="6" x2="84" y2="24" stroke="#C6A15B" strokeWidth="1" />
            <line x1="84" y1="144" x2="84" y2="162" stroke="#C6A15B" strokeWidth="1" />
            <line x1="6" y1="84" x2="24" y2="84" stroke="#C6A15B" strokeWidth="1" />
            <line x1="144" y1="84" x2="162" y2="84" stroke="#C6A15B" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* HUD Overlay Container */}
        <div
          className="container-editorial"
          style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 'clamp(5.5rem, 9vh, 7rem)',
            paddingBottom: 'clamp(2rem, 4.5vh, 3.25rem)',
          }}
        >
          {/* Top Telemetry Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Compass size={14} color="#C6A15B" />
              <span className="micro-label" style={{ color: 'var(--fg-primary)', fontSize: '0.62rem' }}>
                SCROLL-SCRUBBED AERIAL DESCENT · NO. 18 PENINSULA
              </span>
            </div>

            <div
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.1rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <span className="micro-label" style={{ fontSize: '0.62rem', color: 'var(--accent-gold)' }}>
                ALT {altitudeFt} FT
              </span>
              <span
                aria-hidden="true"
                style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-strong)' }}
              />
              <span
                className="micro-label"
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--fg-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Wind size={12} color="#C6A15B" />
                11 KT WNW
              </span>
            </div>
          </div>

          {/* Bottom Narrative Beats (Crossfading with Scroll) */}
          <div style={{ position: 'relative', minHeight: '190px', display: 'flex', alignItems: 'flex-end' }}>
            {/* Beat 1 */}
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                maxWidth: '38rem',
                opacity: beat1Opacity,
                y: beat1Y,
                pointerEvents: 'none',
              }}
            >
              <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                01 / ABOVE THE MARINE LAYER
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.35rem, 5vw, 4.4rem)',
                  fontWeight: 400,
                  lineHeight: 0.96,
                  letterSpacing: '-0.025em',
                  margin: '0.65rem 0 0.85rem 0',
                  textShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                }}
              >
                Hole No. 18 —{' '}
                <em style={{ fontStyle: 'italic', color: 'rgba(243, 239, 230, 0.78)' }}>
                  The Cypress Bluff
                </em>
              </h2>
              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: '1rem',
                  maxWidth: '32rem',
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                }}
              >
                Scroll to descend through the Pacific marine fog canopy onto one of
                golf&rsquo;s most dramatic coastal par-3 peninsulas.
              </p>
            </motion.div>

            {/* Beat 2 */}
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                maxWidth: '40rem',
                opacity: beat2Opacity,
                y: beat2Y,
                pointerEvents: 'none',
              }}
            >
              <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                02 / THE BASALT OCEAN CARRY
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4.6vw, 4rem)',
                  fontWeight: 400,
                  lineHeight: 0.98,
                  letterSpacing: '-0.025em',
                  margin: '0.65rem 0 0.85rem 0',
                  textShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                }}
              >
                194 Yards. 178-Yard Forced Carry Over Surf.
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: '1rem',
                  maxWidth: '34rem',
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                }}
              >
                Carved onto a 150-foot black basalt promontory with a 42-foot vertical
                drop and three white-silica cathedral bunkers guarding the bailout.
              </p>
            </motion.div>

            {/* Beat 3 */}
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '1.5rem',
                opacity: beat3Opacity,
                y: beat3Y,
                pointerEvents: 'none',
              }}
            >
              <div style={{ maxWidth: '36rem' }}>
                <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                  03 / USGA CHAMPIONSHIP SURFACE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.2rem, 4.6vw, 4rem)',
                    fontWeight: 400,
                    lineHeight: 0.98,
                    letterSpacing: '-0.025em',
                    margin: '0.65rem 0 0.75rem 0',
                    textShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  Zero Homes. Zero Crowds. Only the Pacific.
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--fg-secondary)',
                    fontSize: '0.98rem',
                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  Pure 007 creeping bentgrass hand-mown daily to 12.5 Stimp, framed by
                  300 degrees of uninterrupted Monterey surf.
                </p>
              </div>

              <div
                className="glass-surface"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, auto)',
                  gap: '1.35rem',
                  padding: '0.95rem 1.35rem',
                  borderRadius: '20px',
                }}
              >
                {[
                  { k: 'CHAMPIONSHIP TEE', v: '194 yds' },
                  { k: 'ELEVATION', v: '-42 ft' },
                  { k: 'GREEN DEPTH', v: '31 paces' },
                ].map((stat) => (
                  <div key={stat.k}>
                    <span className="micro-label" style={{ display: 'block', fontSize: '0.56rem' }}>
                      {stat.k}
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                      {stat.v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
