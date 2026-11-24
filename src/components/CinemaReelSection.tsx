import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';
import {
  EDITORIAL_EASE,
  usePrefersReducedMotion,
} from './motion/motionHooks';
import {
  CINEMA_CHAPTERS,
  selectAdaptiveVideo,
} from '../data/cinemaChapters';
import {
  startCoastalSoundscape,
  type CoastalSoundscapeController,
} from '../utils/coastalAudio';

interface CinemaReelSectionProps {
  onExpandClick: (chapterIndex: number) => void;
}

export function CinemaReelSection({ onExpandClick }: CinemaReelSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const soundRef = useRef<CoastalSoundscapeController | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const [warmedIndices, setWarmedIndices] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const preObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
          setWarmedIndices((prev) => (prev.includes(0) ? prev : [...prev, 0]));
          preObs.disconnect();
        }
      },
      { rootMargin: '1000px 0px' }
    );
    preObs.observe(el);
    return () => preObs.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInViewport(visible);
        if (visible) {
          setWarmedIndices([0, 1, 2]);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      if (idx === activeIdx && inViewport && !prefersReduced) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIdx, inViewport, prefersReduced, warmedIndices]);

  useEffect(() => {
    if (!soundEnabled || !inViewport) {
      soundRef.current?.stop();
      soundRef.current = null;
      return;
    }
    soundRef.current = startCoastalSoundscape();
    return () => {
      soundRef.current?.stop();
      soundRef.current = null;
    };
  }, [soundEnabled, inViewport]);

  const warmChapter = (idx: number) => {
    setWarmedIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const handleSelectChapter = (nextIdx: number) => {
    if (nextIdx === activeIdx || locked) return;
    warmChapter(nextIdx);
    setLocked(true);
    const nextVideo = videoRefs.current[nextIdx];
    if (nextVideo && !prefersReduced) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
    const outgoingIdx = activeIdx;
    setActiveIdx(nextIdx);

    window.setTimeout(() => {
      videoRefs.current[outgoingIdx]?.pause();
      setLocked(false);
    }, 950);
  };

  const activeChapter = CINEMA_CHAPTERS[activeIdx];

  return (
    <section
      id="cinema"
      ref={sectionRef}
      style={{
        paddingBlock: 'clamp(4.25rem, 10vw, 8.5rem)',
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
            gap: '1.35rem',
            marginBottom: 'clamp(1.65rem, 4vw, 3rem)',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              02 / MOTION ANTHOLOGY
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.15rem, 4.8vw, 4.15rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.025em',
                margin: '0.65rem 0 0 0',
              }}
            >
              Living Atmosphere of the Estate
            </h2>
          </div>

          {/* Single-row swipeable chapter pill rail on mobile */}
          <div
            role="tablist"
            aria-label="Estate film chapters"
            className="glass-surface pill-scroll-rail"
            style={{
              padding: '0.28rem',
              borderRadius: 'var(--radius-pill)',
              gap: '0.2rem',
            }}
          >
            {CINEMA_CHAPTERS.map((chapter, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={chapter.id}
                  id={`cinema-tab-${chapter.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onMouseEnter={() => warmChapter(idx)}
                  onFocus={() => warmChapter(idx)}
                  onClick={() => handleSelectChapter(idx)}
                  style={{
                    position: 'relative',
                    padding: '0.55rem 1rem',
                    minHeight: '42px',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    background: 'transparent',
                    color: isSelected ? '#070A08' : 'var(--fg-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    zIndex: 1,
                    transition: 'color 220ms var(--ease-ui)',
                  }}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="cinema-chapter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--fg-primary)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  {chapter.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cinema Stage: 16:9 on Desktop, Portrait-Friendly 4:5 Card on Mobile */}
        <div className="cinema-stage-viewport">
          {CINEMA_CHAPTERS.map((chapter, idx) => {
            const isActive = idx === activeIdx;
            const isWarmed = nearViewport && warmedIndices.includes(idx);
            const resolvedSrc = isWarmed
              ? selectAdaptiveVideo(chapter.videoSrc, chapter.mobileVideoSrc)
              : undefined;

            return (
              <div
                key={chapter.id}
                aria-hidden={!isActive}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transition: prefersReduced ? 'none' : 'opacity 1000ms ease-in-out',
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={resolvedSrc}
                  poster={chapter.posterSrc}
                  muted
                  loop
                  playsInline
                  preload={isActive && nearViewport ? 'auto' : isWarmed ? 'metadata' : 'none'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: '54% center',
                    display: 'block',
                  }}
                />
              </div>
            );
          })}

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg, rgba(7,10,8,0.56) 0%, transparent 28%, transparent 48%, rgba(7,10,8,0.92) 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 'clamp(0.9rem, 2.5vw, 1.75rem)',
              left: 'clamp(0.9rem, 2.5vw, 2rem)',
              right: 'clamp(0.9rem, 2.5vw, 2rem)',
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div
              className="glass-surface cinema-specs-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.42rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                minWidth: 0,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  flexShrink: 0,
                }}
              />
              <span
                className="micro-label"
                style={{
                  fontSize: '0.58rem',
                  color: 'var(--fg-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeChapter.specs}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
              <button
                id="cinema-soundscape-toggle"
                type="button"
                aria-label={
                  soundEnabled
                    ? 'Mute coastal ambient soundscape'
                    : 'Enable coastal ambient soundscape'
                }
                aria-pressed={soundEnabled}
                onClick={() => setSoundEnabled((s) => !s)}
                className="glass-surface-interactive"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  minHeight: '44px',
                  minWidth: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {soundEnabled ? (
                  <Volume2 size={14} color="#C6A15B" />
                ) : (
                  <VolumeX size={14} color="#8F9891" />
                )}
                <span className="cinema-sound-label">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </button>

              <button
                id="cinema-expand-btn"
                type="button"
                aria-label="Open fullscreen 2.39:1 estate showreel"
                onClick={() => onExpandClick(activeIdx)}
                className="glass-surface-interactive"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  minHeight: '44px',
                  minWidth: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <Maximize2 size={14} color="#C6A15B" />
                <span className="cinema-expand-label">2.39:1 Theatre</span>
              </button>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(1rem, 3vw, 2.25rem)',
              left: 'clamp(1rem, 3vw, 2.25rem)',
              right: 'clamp(1rem, 3vw, 2.25rem)',
              zIndex: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
              style={{ maxWidth: '36rem' }}
            >
              <span className="micro-label" style={{ color: 'var(--accent-gold)', fontSize: '0.6rem' }}>
                CHAPTER {activeChapter.index} · {activeChapter.timecode}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.55rem, 3vw, 2.5rem)',
                  fontWeight: 400,
                  margin: '0.3rem 0 0.35rem 0',
                  lineHeight: 1.05,
                }}
              >
                {activeChapter.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: 'clamp(0.84rem, 1.1vw, 0.92rem)',
                  lineHeight: 1.5,
                }}
              >
                {activeChapter.caption}
              </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              {CINEMA_CHAPTERS.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Jump to ${c.title}`}
                  onMouseEnter={() => warmChapter(idx)}
                  onClick={() => handleSelectChapter(idx)}
                  style={{
                    width: idx === activeIdx ? '36px' : '14px',
                    height: '44px',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'width 300ms var(--ease-editorial)',
                  }}
                >
                  <span
                    style={{
                      width: '100%',
                      height: '3px',
                      borderRadius: '999px',
                      backgroundColor:
                        idx === activeIdx ? 'var(--accent-gold)' : 'rgba(243, 239, 230, 0.28)',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cinema-stage-viewport {
          position: relative;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid var(--border-strong);
          background-color: #050706;
          aspect-ratio: 16 / 9;
          min-height: 360px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.6);
        }
        @media (max-width: 640px) {
          .cinema-stage-viewport {
            aspect-ratio: 4 / 4.75;
            min-height: 410px;
            border-radius: 22px;
          }
          .cinema-expand-label,
          .cinema-sound-label {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
