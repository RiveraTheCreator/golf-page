import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EDITORIAL_EASE, MagneticButton } from './motion/MotionPrimitives';

interface NavbarProps {
  onApplyClick: () => void;
}

const NAV_ITEMS = [
  { id: 'sanctuary', label: 'Sanctuary', href: '#sanctuary' },
  { id: 'pillars', label: 'Estate', href: '#pillars' },
  { id: 'telemetry', label: 'The Lab', href: '#telemetry' },
  { id: 'patronage', label: 'Patronage', href: '#patronage' },
];

export function Navbar({ onApplyClick }: NavbarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('sanctuary');

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.85, delay: 0.05, ease: EDITORIAL_EASE }}
      style={{
        position: 'fixed',
        top: 'clamp(0.85rem, 2vw, 1.5rem)',
        left: 0,
        right: 0,
        zIndex: 80,
        pointerEvents: 'none',
      }}
    >
      <div
        className="container-editorial"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Brand Wordmark + Custom SVG Crest */}
        <a
          href="#top"
          aria-label="Aurelia Links Home"
          className="glass-surface"
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.6rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            minHeight: '44px',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.5" stroke="#C6A15B" strokeWidth="1.25" />
            <path
              d="M12 5.5V18.5M12 5.5L17.5 8.75L12 12"
              stroke="#F3EFE6"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'var(--fg-primary)',
            }}
          >
            AURELIA<sup style={{ fontSize: '0.55em', color: 'var(--accent-gold)' }}>®</sup>
          </span>
        </a>

        {/* Sliding Pill Center Nav (Desktop/Tablet) */}
        <nav
          aria-label="Primary Navigation"
          className="glass-surface nav-pill-desktop"
          onMouseLeave={() => setHoveredId(null)}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            padding: '0.25rem',
            borderRadius: 'var(--radius-pill)',
            gap: '0.15rem',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isHighlighted = (hoveredId ?? activeId) === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredId(item.id)}
                onClick={() => setActiveId(item.id)}
                style={{
                  position: 'relative',
                  padding: '0.55rem 1.05rem',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: isHighlighted ? '#070A08' : 'var(--fg-secondary)',
                  transition: 'color 220ms var(--ease-ui)',
                  borderRadius: 'var(--radius-pill)',
                  minHeight: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {isHighlighted && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--fg-primary)',
                      zIndex: -1,
                    }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Telemetry + Magnetic CTA */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            className="nav-telemetry-desktop"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              lineHeight: 1.25,
            }}
          >
            <span className="micro-label" style={{ fontSize: '0.62rem', color: 'var(--fg-primary)' }}>
              36.5674° N · 121.9486° W
            </span>
            <span
              className="micro-label"
              style={{
                fontSize: '0.6rem',
                color: 'var(--accent-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  display: 'inline-block',
                }}
              />
              11.8 STIMP · 9 KT WNW
            </span>
          </div>

          <MagneticButton
            onClick={onApplyClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--fg-primary)',
              color: '#070A08',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <span>Apply</span>
            <ArrowUpRight size={15} strokeWidth={2} />
          </MagneticButton>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-telemetry-desktop {
            display: none !important;
          }
        }
        @media (max-width: 680px) {
          .nav-pill-desktop {
            display: none !important;
          }
        }
      `}</style>
    </motion.header>
  );
}
