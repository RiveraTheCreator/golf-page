import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Film, Menu, X } from 'lucide-react';
import { MagneticButton } from './motion/MotionPrimitives';
import { EDITORIAL_EASE, useModalLifecycle } from './motion/motionHooks';

interface NavbarProps {
  onApplyClick: () => void;
  onWatchFilmClick: () => void;
}

const NAV_ITEMS = [
  { id: 'sanctuary', label: 'Sanctuary', href: '#sanctuary' },
  { id: 'bluff-stage', label: '18th Bluff', href: '#bluff-stage' },
  { id: 'cinema', label: 'Film', href: '#cinema' },
  { id: 'pillars', label: 'Estate', href: '#pillars' },
  { id: 'telemetry', label: 'The Lab', href: '#telemetry' },
  { id: 'patronage', label: 'Patronage', href: '#patronage' },
];

export function Navbar({ onApplyClick, onWatchFilmClick }: NavbarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('sanctuary');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useModalLifecycle(mobileMenuOpen, () => setMobileMenuOpen(false));

  useEffect(() => {
    const elements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.2, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, delay: 0.05, ease: EDITORIAL_EASE }}
        style={{
          position: 'fixed',
          top: 'max(0.85rem, env(safe-area-inset-top))',
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
            gap: '0.75rem',
          }}
        >
          {/* Brand Wordmark + Custom SVG Crest */}
          <a
            id="nav-brand-home"
            href="#top"
            aria-label="Aurelia Links Home"
            className="glass-surface-interactive"
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

          {/* Sliding Pill Center Nav (Desktop) */}
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
              gap: '0.1rem',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isHighlighted = (hoveredId ?? activeId) === item.id;
              return (
                <a
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  href={item.href}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  style={{
                    position: 'relative',
                    padding: '0.52rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    color: isHighlighted ? '#070A08' : 'var(--fg-secondary)',
                    transition: 'color 220ms var(--ease-ui)',
                    borderRadius: 'var(--radius-pill)',
                    minHeight: '38px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
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

          {/* Right Telemetry + Magnetic CTA + Mobile Menu Trigger */}
          <div
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              className="nav-telemetry-desktop"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.25,
                marginRight: '0.35rem',
              }}
            >
              <span className="micro-label" style={{ fontSize: '0.6rem', color: 'var(--fg-primary)' }}>
                36.5674° N · 121.9486° W
              </span>
              <span
                className="micro-label"
                style={{
                  fontSize: '0.58rem',
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
                12.5 STIMP · 9 KT WNW
              </span>
            </div>

            <MagneticButton
              id="nav-apply-cta"
              onClick={onApplyClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.2rem',
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
              <ArrowUpRight size={15} strokeWidth={2} className="cta-arrow-disc" />
            </MagneticButton>

            <button
              id="nav-mobile-toggle"
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="glass-surface-interactive nav-mobile-btn"
              style={{
                display: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-primary)',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Glass Sheet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 75,
              backgroundColor: 'rgba(7, 10, 8, 0.92)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '6rem 1.75rem 2.5rem',
            }}
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '420px',
                width: '100%',
                marginInline: 'auto',
              }}
            >
              <span
                className="micro-label"
                style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem' }}
              >
                MONTEREY PENINSULA · 12.5 STIMP
              </span>

              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveId(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.15rem',
                    fontWeight: 400,
                    paddingBlock: '0.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--fg-primary)',
                  }}
                >
                  <span>{item.label}</span>
                  <span className="micro-label" style={{ fontSize: '0.68rem' }}>
                    0{index + 1}
                  </span>
                </a>
              ))}

              <div
                style={{
                  marginTop: '1.75rem',
                  display: 'grid',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onWatchFilmClick();
                  }}
                  className="glass-surface-interactive"
                  style={{
                    minHeight: '48px',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--fg-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  <Film size={16} color="#C6A15B" />
                  <span>Watch Estate Showreel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onApplyClick();
                  }}
                  style={{
                    minHeight: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#070A08',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Request Private Dossier</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1120px) {
          .nav-telemetry-desktop {
            display: none !important;
          }
        }
        @media (max-width: 820px) {
          .nav-pill-desktop {
            display: none !important;
          }
          .nav-mobile-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
