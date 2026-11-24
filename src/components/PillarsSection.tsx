import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, Film, X } from 'lucide-react';
import {
  EDITORIAL_EASE,
  useModalLifecycle,
  usePrefersReducedMotion,
} from './motion/motionHooks';
import { selectAdaptiveVideo } from '../data/cinemaChapters';

export interface EstatePillar {
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  video: string;
  mobileVideo: string;
  alt: string;
  specs: { label: string; value: string }[];
  dossier: string;
}

const PILLARS: EstatePillar[] = [
  {
    index: '01',
    tag: 'THE LINKS',
    title: 'Cliffside Championship Routing',
    subtitle:
      '7,420 yards of wind-sculpted coastal fescue, dramatic oceanfront par-3s, and USGA-spec bentgrass greens maintained at 12.5 Stimp.',
    image: '/images/par3-green.jpg?v=1080p',
    video: '/videos/hero-links.mp4?v=1080p',
    mobileVideo: '/videos/hero-links-mobile.mp4?v=1080p',
    alt: 'Aerial view of Aurelia cliffside par-3 golf green at dawn with ocean mist',
    specs: [
      { label: 'ROUTING', value: 'Par 72 · 7,420 yds' },
      { label: 'GREENS', value: '12.5 Stimp Spec' },
      { label: 'TURF', value: 'Fescue & Bent' },
    ],
    dossier:
      'Carved directly into 140-foot coastal bluffs with zero housing developments in sight. Every hole plays into shifting Pacific thermals, offering five distinct teeing grounds and a dedicated 6-hole short-game sanctuary.',
  },
  {
    index: '02',
    tag: 'THE LAB',
    title: 'Tour Biomechanics & 3D Force Plates',
    subtitle:
      'Dual-radar launch telemetry, 1,000-fps optical club tracking, and an in-house Tour van for custom forging and shaft Puring.',
    image: '/images/perf-lab.jpg?v=1080p',
    video: '/videos/swing-impact.mp4?v=1080p',
    mobileVideo: '/videos/swing-impact-mobile.mp4?v=1080p',
    alt: 'Private dark-mode golf performance and biomechanics lab with forged iron',
    specs: [
      { label: 'CAPTURE', value: '1,000 FPS Radar' },
      { label: 'FORCE', value: '3D Dual Plates' },
      { label: 'FORGE', value: 'Custom Japanese' },
    ],
    dossier:
      'Led by former PGA Tour biomechanists and master clubmakers. Patrons receive quarterly 3D kinematic baselines, real-time ball-flight dispersion modeling, and custom-ground wedges forged on-site.',
  },
  {
    index: '03',
    tag: 'THE CLUBHOUSE',
    title: 'Board-Formed Concrete & Cellar',
    subtitle:
      'Fourteen private ocean-view suites, contrast hydrotherapy recovery suites, and a 4,000-bottle sommelier vault overlooking the 18th.',
    image: '/images/clubhouse-dusk.jpg?v=1080p',
    video: '/videos/clubhouse-dusk.mp4?v=1080p',
    mobileVideo: '/videos/clubhouse-dusk-mobile.mp4?v=1080p',
    alt: 'Modern board-formed concrete and glass golf clubhouse glowing at dusk',
    specs: [
      { label: 'SUITES', value: '14 Ocean Villas' },
      { label: 'RECOVERY', value: 'Cryo & Hydro Spa' },
      { label: 'CELLAR', value: '4,000-Bottle Vault' },
    ],
    dossier:
      'Designed as a quiet monolithic sanctuary of board-formed concrete, smoked walnut, and frameless glass. Arrive by private aviation to Monterey Regional (MRY) with 12-minute chauffeur transfer.',
  },
];

interface PillarCardProps {
  pillar: EstatePillar;
  index: number;
  total: number;
  progress: MotionValue<number>;
  prefersReduced: boolean;
  sectionNear: boolean;
  onInspect: (pillar: EstatePillar) => void;
}

function PillarCard({
  pillar,
  index,
  total,
  progress,
  prefersReduced,
  sectionNear,
  onInspect,
}: PillarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchActive, setTouchActive] = useState(false);

  const targetScale = 1 - (total - 1 - index) * 0.04;
  const rangeStart = index / total;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  // Autonomous video preview on touch devices when card is centered in viewport (MotionSites Craft)
  useEffect(() => {
    if (prefersReduced) return;
    if (!window.matchMedia('(hover: none)').matches) return;
    const el = cardRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const active = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.55);
        setTouchActive(active);
        const v = videoRef.current;
        if (!v) return;
        if (active) {
          if (!v.getAttribute('src')) {
            v.src = selectAdaptiveVideo(pillar.video, pillar.mobileVideo);
          }
          v.muted = true;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0.2, 0.55, 0.8] }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [pillar.mobileVideo, pillar.video, prefersReduced]);

  const handleEnter = () => {
    setIsHovered(true);
    if (!prefersReduced && videoRef.current) {
      const targetSrc = selectAdaptiveVideo(pillar.video, pillar.mobileVideo);
      if (!videoRef.current.getAttribute('src')) {
        videoRef.current.src = targetSrc;
      }
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setIsHovered(false);
    if (!touchActive) {
      videoRef.current?.pause();
    }
  };

  const showVideo = (isHovered || touchActive) && !prefersReduced;
  const resolvedSrc =
    sectionNear || showVideo
      ? selectAdaptiveVideo(pillar.video, pillar.mobileVideo)
      : undefined;

  return (
    <div
      ref={cardRef}
      className="pillar-sticky-slot"
      style={{
        position: 'sticky',
        top: `calc(5rem + ${index * 20}px)`,
        marginBottom: index === total - 1 ? 0 : 'clamp(2.25rem, 5vw, 4rem)',
      }}
    >
      <motion.article
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        style={{
          scale,
          transformOrigin: 'top center',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
          willChange: 'transform',
        }}
      >
        <div className="pillar-card-grid">
          {/* Left Content Column */}
          <div className="pillar-card-body">
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'clamp(1rem, 2.5vw, 1.75rem)',
                }}
              >
                <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                  {pillar.index} / {pillar.tag}
                </span>
                <span
                  className="micro-label"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: showVideo ? 'var(--accent-gold)' : 'var(--fg-muted)',
                    transition: 'color 220ms var(--ease-ui)',
                    fontSize: '0.6rem',
                  }}
                >
                  <Film size={12} />
                  {showVideo ? 'REEL LIVE' : 'MOTION REEL'}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3.2vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 1.04,
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.75rem 0',
                  color: 'var(--fg-primary)',
                }}
              >
                {pillar.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: 'clamp(0.9rem, 1.2vw, 0.98rem)',
                  lineHeight: 1.55,
                  fontWeight: 300,
                  maxWidth: '36ch',
                }}
              >
                {pillar.subtitle}
              </p>
            </div>

            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '0.75rem',
                  paddingBlock: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.15rem',
                }}
              >
                {pillar.specs.map((spec) => (
                  <div key={spec.label}>
                    <span
                      className="micro-label"
                      style={{ display: 'block', fontSize: '0.54rem', marginBottom: '0.22rem' }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        color: 'var(--fg-primary)',
                      }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                id={`pillar-dossier-btn-${pillar.index}`}
                type="button"
                onClick={() => onInspect(pillar)}
                className="glass-surface-interactive pillar-inspect-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.72rem 1.35rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                }}
              >
                <span>Inspect Dossier</span>
                <ArrowUpRight size={15} color="#C6A15B" className="cta-arrow-disc" />
              </button>
            </div>
          </div>

          {/* Media Column (Top on Mobile, Right on Desktop) */}
          <div className="pillar-card-media">
            <motion.img
              src={pillar.image}
              alt={pillar.alt}
              loading="lazy"
              animate={{ scale: showVideo ? 1.04 : 1 }}
              transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {!prefersReduced && (
              <video
                ref={videoRef}
                src={resolvedSrc}
                muted
                loop
                playsInline
                preload={sectionNear ? 'metadata' : 'none'}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: showVideo ? 1 : 0,
                  transition: 'opacity 600ms var(--ease-editorial)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function PillarsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [selectedPillar, setSelectedPillar] = useState<EstatePillar | null>(null);
  const [sectionNear, setSectionNear] = useState(false);

  useModalLifecycle(Boolean(selectedPillar), () => setSelectedPillar(null));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSectionNear(true);
          obs.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="pillars"
      ref={containerRef}
      style={{
        paddingBlock: 'clamp(4rem, 8vw, 7rem)',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-editorial">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.25rem',
            marginBottom: 'clamp(2.25rem, 5vw, 4rem)',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              03 / THE ESTATE PILLARS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 4.25rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.025em',
                margin: '0.65rem 0 0 0',
              }}
            >
              Three Pillars of the Sanctuary
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              maxWidth: '28rem',
              color: 'var(--fg-muted)',
              fontSize: '0.94rem',
            }}
          >
            Every square meter of the $100M Monterey peninsula estate is built
            for championship play, biometric mastery, and quiet restoration.
          </p>
        </div>

        <div>
          {PILLARS.map((pillar, idx) => (
            <PillarCard
              key={pillar.index}
              pillar={pillar}
              index={idx}
              total={PILLARS.length}
              progress={scrollYProgress}
              prefersReduced={prefersReduced}
              sectionNear={sectionNear}
              onInspect={setSelectedPillar}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPillar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedPillar(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: 'rgba(7, 10, 8, 0.84)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="dossier-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '640px',
                maxHeight: '90dvh',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: '24px',
              }}
            >
              <div style={{ position: 'relative', height: 'clamp(190px, 32vh, 250px)', backgroundColor: '#070A08' }}>
                {prefersReduced ? (
                  <img
                    src={selectedPillar.image}
                    alt={selectedPillar.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <video
                    src={selectAdaptiveVideo(selectedPillar.video, selectedPillar.mobileVideo)}
                    poster={selectedPillar.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <button
                  type="button"
                  aria-label="Close dossier"
                  onClick={() => setSelectedPillar(null)}
                  className="glass-surface-interactive"
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--fg-primary)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <div
                style={{
                  padding: 'clamp(1.35rem, 3.5vw, 2.25rem)',
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                }}
              >
                <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                  {selectedPillar.index} / {selectedPillar.tag} DOSSIER
                </span>
                <h3
                  id="dossier-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 4vw, 2.15rem)',
                    fontWeight: 400,
                    margin: '0.45rem 0 0.85rem 0',
                  }}
                >
                  {selectedPillar.title}
                </h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.62, margin: '0 0 1.35rem 0', fontSize: '0.94rem' }}>
                  {selectedPillar.dossier}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '0.75rem',
                    paddingTop: '1.1rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  {selectedPillar.specs.map((spec) => (
                    <div key={spec.label}>
                      <span className="micro-label" style={{ display: 'block', fontSize: '0.56rem' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pillar-card-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
          min-height: clamp(420px, 58vh, 560px);
        }
        .pillar-card-body {
          padding: clamp(1.4rem, 3.5vw, 3.25rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .pillar-card-media {
          position: relative;
          overflow: hidden;
          min-height: 280px;
          background-color: #070A08;
        }
        @media (max-width: 860px) {
          .pillar-card-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .pillar-card-media {
            order: -1;
            min-height: 205px;
            max-height: 225px;
          }
          .pillar-inspect-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
