import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Compass } from 'lucide-react';
import { EDITORIAL_EASE, MagneticButton, MaskedLine } from './motion/MotionPrimitives';

interface HeroSectionProps {
  onApplyClick: () => void;
}

export function HeroSection({ onApplyClick }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

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
        paddingTop: '7rem',
        paddingBottom: 'clamp(2.25rem, 5vh, 4rem)',
      }}
    >
      {/* Full-bleed Parallax Links Photography */}
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
        <motion.img
          src="/images/hero-links.jpg"
          alt="Aurelia coastal championship golf fairway and sculpted bunker at twilight"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EDITORIAL_EASE }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 42%',
            display: 'block',
          }}
        />
        {/* Top & bottom obsidian edge vignettes so photo melts into #070A08 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(7,10,8,0.68) 0%, rgba(7,10,8,0.12) 38%, rgba(7,10,8,0.52) 72%, rgba(7,10,8,0.96) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 70% 40%, transparent 25%, rgba(7,10,8,0.55) 100%)',
          }}
        />
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
          transition={{ duration: 0.7, delay: 0.15, ease: EDITORIAL_EASE }}
          className="micro-label"
          style={{
            marginBottom: '1.15rem',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <span>MONTEREY PENINSULA · PRIVATE SANCTUARY</span>
        </motion.div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(3.1rem, 7.2vw, 6.75rem)',
            lineHeight: 0.94,
            letterSpacing: '-0.03em',
            margin: 0,
            color: 'var(--fg-primary)',
            maxWidth: '14ch',
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

        {/* Bottom Split Row: Subcopy Left, CTAs + Quiet Stats Right */}
        <div
          className="hero-bottom-grid"
          style={{
            marginTop: 'clamp(1.75rem, 3.5vw, 3rem)',
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
            }}
          >
            An ultra-private coastal links estate and Tour-grade biomechanics
            performance lab. Engineered for 150 Founding Patrons who demand
            unhurried precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.68, ease: EDITORIAL_EASE }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <MagneticButton
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

            <a
              href="#pillars"
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.9rem 1.45rem',
                minHeight: '48px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--fg-primary)',
                transition: 'border-color 220ms var(--ease-ui)',
              }}
            >
              <Compass size={16} color="#C6A15B" />
              <span>Explore 18 Holes</span>
            </a>
          </motion.div>
        </div>

        {/* Quiet 3-Stat Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EDITORIAL_EASE }}
          style={{
            marginTop: 'clamp(2rem, 4vw, 3.25rem)',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[
            { label: 'ROUTING', value: 'Par 72 · 7,420 yds' },
            { label: 'PATRONAGE CAP', value: '150 Founding Members' },
            { label: 'ESTATE ENDOWMENT', value: '$100M Private Capital' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="micro-label" style={{ fontSize: '0.62rem' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--fg-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
