import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { MagneticButton, MaskedLine } from './motion/MotionPrimitives';
import { EDITORIAL_EASE, usePrefersReducedMotion } from './motion/motionHooks';

interface HeroSectionProps {
  onApplyClick: () => void;
  onWatchFilmClick: () => void;
}

export function HeroSection({ onApplyClick, onWatchFilmClick }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [videoReady, setVideoReady] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.12]);

  // Off-screen IntersectionObserver auto-pause + reduced-motion compliance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;

    if (prefersReduced || userPaused) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !userPaused && !prefersReduced) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    video.play().catch(() => {});

    return () => observer.disconnect();
  }, [prefersReduced, userPaused]);

  const isPlaying = !prefersReduced && !userPaused;

  return (
    <section
      id="top"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
        paddingTop: '7rem',
        paddingBottom: 'clamp(2.25rem, 5vh, 3.75rem)',
      }}
    >
      {/* Full-bleed Parallax Links Video Motion Plane */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-4% 0 -8% 0',
          y: mediaY,
          scale: mediaScale,
          zIndex: 0,
        }}
      >
        {/* High-res instant poster underneath so zero blank frame ever flashes */}
        <img
          src="/images/hero-links.jpg"
          alt=""
          fetchPriority="high"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 42%',
            display: 'block',
          }}
        />

        {/* Muted H.264 +faststart 1080p Full HD (720p Mobile Adaptive) Twilight Links Cinema Loop */}
        <video
          ref={videoRef}
          poster="/images/hero-links.jpg"
          autoPlay={!prefersReduced}
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 42%',
            display: 'block',
            opacity: videoReady ? 1 : 0,
            transform: videoReady || prefersReduced ? 'scale(1)' : 'scale(1.05)',
            transition: prefersReduced
              ? 'none'
              : 'opacity 1.5s var(--ease-editorial), transform 1.8s var(--ease-editorial)',
          }}
        >
          <source
            media="(max-width: 768px)"
            src="/videos/hero-links-mobile.mp4"
            type="video/mp4"
          />
          <source src="/videos/hero-links.mp4" type="video/mp4" />
        </video>

        {/* Progressive depth-of-field bottom blur + multi-stop obsidian scrim */}
        <div className="hero-progressive-blur" />
        <div className="scrim-hero-eased" />
      </motion.div>

      {/* Bottom-Anchored Editorial Composition */}
      <motion.div
        className="container-editorial"
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: contentOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EDITORIAL_EASE }}
          className="micro-label"
          style={{
            marginBottom: '1.15rem',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '28px',
              height: '1px',
              backgroundColor: 'var(--accent-gold)',
              display: 'inline-block',
            }}
          />
          <span>MONTEREY PENINSULA · PRIVATE LINKS &amp; BIOMECHANICS</span>
        </motion.div>

        <h1
          className="hero-display-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2.95rem, 6.4vw, 6.35rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            margin: 0,
            color: 'var(--fg-primary)',
            maxWidth: '18ch',
            textShadow: '0 16px 38px rgba(0, 0, 0, 0.34)',
          }}
        >
          <MaskedLine delay={0.18}>Where Architecture</MaskedLine>
          <MaskedLine delay={0.29}>
            Meets{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: 'rgba(243, 239, 230, 0.74)',
                fontWeight: 400,
              }}
            >
              Championship
            </em>
          </MaskedLine>
          <MaskedLine delay={0.4}>Solitude.</MaskedLine>
        </h1>

        {/* Bottom Split Row: Subcopy Left, CTAs + Showreel Trigger Right */}
        <div
          className="hero-bottom-grid"
          style={{
            marginTop: 'clamp(1.75rem, 3.5vw, 2.85rem)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease: EDITORIAL_EASE }}
            style={{
              margin: 0,
              maxWidth: '33rem',
              fontSize: 'clamp(0.98rem, 1.35vw, 1.15rem)',
              lineHeight: 1.6,
              color: 'var(--fg-secondary)',
              fontWeight: 300,
              textShadow: '0 2px 18px rgba(0, 0, 0, 0.42)',
            }}
          >
            An ultra-private coastal links estate and 1,000-fps Tour biomechanics
            performance lab. Engineered for 150 Founding Patrons who measure
            legacy in precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.68, ease: EDITORIAL_EASE }}
            className="hero-cta-row"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <MagneticButton
              id="hero-request-dossier-btn"
              onClick={onApplyClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.9rem 1.65rem',
                minHeight: '48px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--fg-primary)',
                color: '#070A08',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              <span>Request Private Dossier</span>
              <span
                className="cta-arrow-disc"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#070A08',
                  color: 'var(--fg-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowUpRight size={14} />
              </span>
            </MagneticButton>

            {/* Secondary Cinema Showreel Button */}
            <button
              id="hero-watch-film-btn"
              type="button"
              onClick={onWatchFilmClick}
              className="glass-surface-interactive"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.55rem 1.35rem 0.55rem 0.6rem',
                minHeight: '48px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--fg-primary)',
              }}
            >
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(198, 161, 91, 0.18)',
                  border: '1px solid rgba(198, 161, 91, 0.55)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                }}
              >
                <Play size={13} fill="#C6A15B" />
              </span>
              <span>Watch Estate Film</span>
              <span
                className="micro-label"
                style={{ fontSize: '0.62rem', color: 'var(--fg-muted)', marginLeft: '0.15rem' }}
              >
                01:12
              </span>
            </button>
          </motion.div>
        </div>

        {/* Quiet 3-Stat Strip + WCAG 2.2 Ambient Video Pause Control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EDITORIAL_EASE }}
          style={{
            marginTop: 'clamp(1.85rem, 3.8vw, 3rem)',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
              gap: '1.25rem',
              flex: '1 1 520px',
            }}
          >
            {[
              { label: 'CHAMPIONSHIP ROUTING', value: 'Par 72 · 7,420 yds' },
              { label: 'PATRONAGE CAP', value: '150 Founding Members' },
              { label: 'ESTATE ENDOWMENT', value: '$100M Private Capital' },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem' }}
              >
                <span className="micro-label" style={{ fontSize: '0.6rem' }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: 'var(--fg-primary)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {!prefersReduced && (
            <button
              id="hero-ambient-video-toggle"
              type="button"
              aria-label={isPlaying ? 'Pause background links video' : 'Play background links video'}
              aria-pressed={!isPlaying}
              onClick={() => setUserPaused((p) => !p)}
              className="glass-surface-interactive"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.95rem',
                minHeight: '44px',
                minWidth: '44px',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--fg-secondary)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {isPlaying ? <Pause size={13} color="#C6A15B" /> : <Play size={13} color="#C6A15B" />}
              <span>{isPlaying ? 'Motion Live' : 'Motion Paused'}</span>
            </button>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 560px) {
          .hero-cta-row {
            width: 100%;
          }
          .hero-cta-row > * {
            flex: 1 1 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
