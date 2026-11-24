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
    image: '/images/par3-green.jpg',
    video: '/videos/hero-links.mp4',
    mobileVideo: '/videos/hero-links-mobile.mp4',
    alt: 'Aerial view of Aurelia cliffside par-3 golf green at dawn with ocean mist',
    specs: [
      { label: 'ARCHITECTURAL PAR', value: 'Par 72 · 7,420 Yards' },
      { label: 'GREEN SPEED', value: '12.5 Stimp Tournament Spec' },
      { label: 'TURF', value: 'Pure Fescue & Bentgrass' },
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
    image: '/images/perf-lab.jpg',
    video: '/videos/swing-impact.mp4',
    mobileVideo: '/videos/swing-impact-mobile.mp4',
    alt: 'Private dark-mode golf performance and biomechanics lab with forged iron',
    specs: [
      { label: 'OPTICAL CAPTURE', value: '1,000 FPS Dual-Radar' },
      { label: 'GROUND FORCE', value: '3D Dual Force Plates' },
      { label: 'CLUB WORKSHOP', value: 'Bespoke Japanese Forging' },
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
    image: '/images/clubhouse-dusk.jpg',
    video: '/videos/clubhouse-dusk.mp4',
    mobileVideo: '/videos/clubhouse-dusk-mobile.mp4',
    alt: 'Modern board-formed concrete and glass golf clubhouse glowing at dusk',
    specs: [
      { label: 'ACCOMMODATION', value: '14 Private Ocean Suites' },
      { label: 'RECOVERY', value: 'Cryo, Sauna & Physio Suite' },
      { label: 'DINING', value: '4,000-Bottle Vault & Hearth' },
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const targetScale = 1 - (total - 1 - index) * 0.04;
  const rangeStart = index / total;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

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
    videoRef.current?.pause();
  };

  const resolvedSrc =
    sectionNear || isHovered
      ? selectAdaptiveVideo(pillar.video, pillar.mobileVideo)
      : undefined;

  return (
    <div
      style={{
        position: 'sticky',
        top: `calc(5.5rem + ${index * 26}px)`,
        marginBottom: index === total - 1 ? 0 : '4rem',
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
        <div
          className="pillar-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.15fr)',
            minHeight: 'clamp(420px, 58vh, 560px)',
          }}
        >
          <div
            style={{
              padding: 'clamp(1.75rem, 3.5vw, 3.25rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.75rem',
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
                    color: isHovered && !prefersReduced ? 'var(--accent-gold)' : 'var(--fg-muted)',
                    transition: 'color 220ms var(--ease-ui)',
                  }}
                >
                  <Film size={12} />
                  {isHovered && !prefersReduced ? '1080P REEL LIVE' : 'HOVER PREVIEW'}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.2vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 1.04,
                  letterSpacing: '-0.02em',
                  margin: '0 0 1rem 0',
                  color: 'var(--fg-primary)',
                }}
              >
                {pillar.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  fontWeight: 300,
                  maxWidth: '34ch',
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
                  gap: '1rem',
                  paddingBlock: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.5rem',
                }}
              >
                {pillar.specs.map((spec) => (
                  <div key={spec.label}>
                    <span
                      className="micro-label"
                      style={{ display: 'block', fontSize: '0.58rem', marginBottom: '0.3rem' }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.82rem',
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
                className="glass-surface-interactive"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.35rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <span>Inspect Dossier</span>
                <ArrowUpRight size={15} color="#C6A15B" className="cta-arrow-disc" />
              </button>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
              backgroundColor: '#070A08',
            }}
          >
            <motion.img
              src={pillar.image}
              alt={pillar.alt}
              loading="lazy"
              animate={{ scale: isHovered ? 1.04 : 1 }}
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
                  opacity: isHovered ? 1 : 0,
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
            gap: '1.5rem',
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              03 / THE ESTATE PILLARS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5vw, 4.25rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.025em',
                margin: '0.75rem 0 0 0',
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
              fontSize: '0.95rem',
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
              backgroundColor: 'rgba(7, 10, 8, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
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
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: '24px',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', height: '250px', backgroundColor: '#070A08' }}>
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
                    top: '1rem',
                    right: '1rem',
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
              <div style={{ padding: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}>
                <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                  {selectedPillar.index} / {selectedPillar.tag} DOSSIER
                </span>
                <h3
                  id="dossier-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.15rem',
                    fontWeight: 400,
                    margin: '0.5rem 0 1rem 0',
                  }}
                >
                  {selectedPillar.title}
                </h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.65, margin: '0 0 1.5rem 0' }}>
                  {selectedPillar.dossier}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '1rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  {selectedPillar.specs.map((spec) => (
                    <div key={spec.label}>
                      <span className="micro-label" style={{ display: 'block', fontSize: '0.58rem' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .pillar-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
