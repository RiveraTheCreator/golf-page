import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, Wind } from 'lucide-react';
import { usePrefersReducedMotion } from './motion/motionHooks';
import { selectAdaptiveVideo } from '../data/cinemaChapters';

/**
 * Act III — Scroll-Scrubbed Aerial Flyover Stage (1080p Desktop / Memory-Safe Retina Mobile).
 * - Desktop: 72 native 1920x1080 GPU ImageBitmaps
 * - Mobile: 36 crisp 960x540 GPU ImageBitmaps (~55 MB VRAM budget so iOS Safari never reloads tab),
 *   100svh sticky frame, compact single-row top telemetry, and elevated reticle so Beat 3 never overlaps.
 */
export function SignatureHoleStage() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasFrames, setHasFrames] = useState(false);
  const [altitudeFt, setAltitudeFt] = useState(420);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const beat1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.26, 0.36], [1, 1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.36], ['0px', '-24px']);

  const beat2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.6, 0.7], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.32, 0.45, 0.7], ['24px', '0px', '-20px']);

  const beat3Opacity = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1]);
  const beat3Y = useTransform(scrollYProgress, [0.66, 0.8], ['24px', '0px']);

  const reticleOpacity = useTransform(scrollYProgress, [0.52, 0.74, 1], [0, 0.9, 0.95]);
  const reticleScale = useTransform(scrollYProgress, [0.52, 0.82], [1.4, 1]);

  useEffect(() => {
    if (prefersReduced || shouldLoad) return;
    const track = trackRef.current;
    if (!track) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: '1200px 0px' }
    );
    obs.observe(track);
    return () => obs.disconnect();
  }, [prefersReduced, shouldLoad]);

  useEffect(() => {
    if (prefersReduced || !shouldLoad) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!video || !canvas || !track) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;
    let smoothProgress = 0;
    let lastFrameIdx = -1;
    let cachedBitmaps: ImageBitmap[] = [];

    const resizeCanvas = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      lastFrameIdx = -1;
    };

    const drawCover = (source: ImageBitmap) => {
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

    const extractNativeHdBitmaps = async () => {
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
      const frameCount = isMobile ? 36 : 72;
      const built: ImageBitmap[] = [];

      for (let i = 0; i < frameCount; i++) {
        if (disposed) {
          built.forEach((b) => b.close());
          return;
        }
        const targetTime = (i / (frameCount - 1)) * Math.max(0.08, extractor.duration - 0.04);
        await seekHelper(extractor, targetTime);
        try {
          const bmp = isMobile
            ? await createImageBitmap(extractor, {
                resizeWidth: 960,
                resizeHeight: 540,
                resizeQuality: 'high',
              })
            : await createImageBitmap(extractor);
          built.push(bmp);
        } catch {
          break;
        }
      }

      if (!disposed && built.length > 0) {
        cachedBitmaps = built;
        lastFrameIdx = -1;
        setHasFrames(true);
      } else {
        built.forEach((b) => b.close());
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

      if (cachedBitmaps.length > 0) {
        const idx = Math.min(
          cachedBitmaps.length - 1,
          Math.max(0, Math.round(smoothProgress * (cachedBitmaps.length - 1)))
        );
        if (idx !== lastFrameIdx) {
          drawCover(cachedBitmaps[idx]);
          lastFrameIdx = idx;
        }
      } else if (video.readyState >= 1 && video.duration) {
        const targetTime = smoothProgress * Math.max(0.08, video.duration - 0.04);
        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chosenSrc = selectAdaptiveVideo(
      '/videos/aerial-scrub.mp4?v=1080p',
      '/videos/aerial-scrub-mobile.mp4?v=1080p'
    );
    if (video.getAttribute('src') !== chosenSrc) {
      video.src = chosenSrc;
    }
    video.muted = true;
    video.playsInline = true;
    video.play().then(() => video.pause()).catch(() => {});

    const onLoadedData = () => {
      if (disposed) return;
      setHasVideo(true);
      window.setTimeout(() => {
        if (!disposed) {
          void extractNativeHdBitmaps();
        }
      }, 200);
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
      cachedBitmaps.forEach((bmp) => bmp.close());
    };
  }, [prefersReduced, shouldLoad]);

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
              src="/images/aerial-18th.jpg?v=1080p"
              alt="Aerial view of Aurelia 18th peninsula green jutting into Pacific Ocean surf at twilight"
              loading="lazy"
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
      className="bluff-track-section"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div
        className="bluff-sticky-viewport"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#070A08',
        }}
      >
        <img
          src="/images/aerial-18th.jpg?v=1080p"
          alt="Aerial view of Aurelia 18th cliffside peninsula par-3 surrounded by Pacific surf"
          loading="lazy"
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

        <video
          ref={videoRef}
          muted
          playsInline
          preload={shouldLoad ? 'auto' : 'none'}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hasVideo && !hasFrames ? 1 : 0,
            transition: 'opacity 400ms ease',
            pointerEvents: 'none',
          }}
        />

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: hasFrames ? 1 : 0,
            transition: 'opacity 400ms ease',
            pointerEvents: 'none',
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, #070A08 0%, rgba(7,10,8,0.32) 16%, rgba(7,10,8,0.14) 48%, rgba(7,10,8,0.78) 82%, #070A08 100%)',
          }}
        />

        {/* Center Architectural Target Reticle */}
        <motion.div
          aria-hidden="true"
          className="bluff-reticle-wrap"
          style={{
            position: 'absolute',
            left: '50%',
            x: '-50%',
            y: '-50%',
            opacity: reticleOpacity,
            scale: reticleScale,
            pointerEvents: 'none',
            zIndex: 4,
          }}
        >
          <svg
            className="bluff-reticle-svg"
            width="168"
            height="168"
            viewBox="0 0 168 168"
            fill="none"
          >
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
            paddingTop: 'clamp(4.85rem, 9vh, 7rem)',
            paddingBottom: 'clamp(1.5rem, 4vh, 3.25rem)',
          }}
        >
          {/* Top Telemetry Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Compass size={13} color="#C6A15B" />
              <span
                className="micro-label bluff-badge-desktop"
                style={{ color: 'var(--fg-primary)', fontSize: '0.6rem' }}
              >
                SCROLL-SCRUBBED 1080P DESCENT · NO. 18 PENINSULA
              </span>
              <span
                className="micro-label bluff-badge-mobile"
                style={{ color: 'var(--fg-primary)', fontSize: '0.58rem' }}
              >
                NO. 18 PENINSULA
              </span>
            </div>

            <div
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <span className="micro-label" style={{ fontSize: '0.58rem', color: 'var(--accent-gold)' }}>
                ALT {altitudeFt} FT
              </span>
              <span
                aria-hidden="true"
                className="bluff-wind-sep"
                style={{ width: '1px', height: '11px', backgroundColor: 'var(--border-strong)' }}
              />
              <span
                className="micro-label bluff-wind-label"
                style={{
                  fontSize: '0.58rem',
                  color: 'var(--fg-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Wind size={11} color="#C6A15B" />
                11 KT
              </span>
            </div>
          </div>

          {/* Bottom Narrative Beats */}
          <div style={{ position: 'relative', minHeight: '220px', display: 'flex', alignItems: 'flex-end' }}>
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
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
                  fontSize: 'clamp(2.05rem, 5vw, 4.4rem)',
                  fontWeight: 400,
                  lineHeight: 0.98,
                  letterSpacing: '-0.025em',
                  margin: '0.55rem 0 0.7rem 0',
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
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  maxWidth: '32rem',
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                }}
              >
                Scroll to descend through the Pacific marine fog canopy onto one of
                golf&rsquo;s most dramatic coastal par-3 peninsulas.
              </p>
            </motion.div>

            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
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
                  fontSize: 'clamp(1.95rem, 4.6vw, 4rem)',
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: '-0.025em',
                  margin: '0.55rem 0 0.7rem 0',
                  textShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                }}
              >
                194 Yards. 178-Yard Forced Carry Over Surf.
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  maxWidth: '34rem',
                  textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                }}
              >
                Carved onto a 150-foot black basalt promontory with a 42-foot vertical
                drop and three white-silica cathedral bunkers guarding the bailout.
              </p>
            </motion.div>

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
                gap: '1rem',
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
                    fontSize: 'clamp(1.95rem, 4.6vw, 4rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: '-0.025em',
                    margin: '0.55rem 0 0.6rem 0',
                    textShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  Zero Homes. Zero Crowds. Only the Pacific.
                </h3>
                <p
                  className="bluff-beat3-sub"
                  style={{
                    margin: 0,
                    color: 'var(--fg-secondary)',
                    fontSize: '0.94rem',
                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  Pure 007 creeping bentgrass hand-mown daily to 12.5 Stimp, framed by
                  300 degrees of uninterrupted Monterey surf.
                </p>
              </div>

              <div
                className="glass-surface bluff-specs-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '1rem',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '18px',
                }}
              >
                {[
                  { k: 'TEE', v: '194 yds' },
                  { k: 'DROP', v: '-42 ft' },
                  { k: 'DEPTH', v: '31 paces' },
                ].map((stat) => (
                  <div key={stat.k}>
                    <span className="micro-label" style={{ display: 'block', fontSize: '0.54rem' }}>
                      {stat.k}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
                      {stat.v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .bluff-track-section {
          height: 285vh;
        }
        .bluff-sticky-viewport {
          height: 100vh;
          height: 100svh;
        }
        .bluff-reticle-wrap {
          top: 50%;
        }
        .bluff-badge-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .bluff-track-section {
            height: 245vh;
          }
          .bluff-reticle-wrap {
            top: 41%;
          }
          .bluff-reticle-svg {
            width: 128px;
            height: 128px;
          }
          .bluff-badge-desktop {
            display: none;
          }
          .bluff-badge-mobile {
            display: inline;
          }
          .bluff-specs-card {
            width: 100%;
          }
        }
        @media (max-width: 480px) {
          .bluff-beat3-sub {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
