import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Volume2, VolumeX } from 'lucide-react';
import {
  EDITORIAL_EASE,
  usePrefersReducedMotion,
} from './motion/motionHooks';
import { CINEMA_CHAPTERS } from '../data/cinemaChapters';
import {
  startCoastalSoundscape,
  type CoastalSoundscapeController,
} from '../utils/coastalAudio';

interface CinemaReelSectionProps {
  onExpandClick: (chapterIndex: number) => void;
}

/**
 * Act IV — Crossfading Multi-Video Estate Atmosphere Switcher (MotionSites Technique #9).
 * Stacks 3 looping H.264 films and crossfades over 1000ms with input-lock protection,
 * off-screen IntersectionObserver auto-pause, and optional Web Audio coastal soundscape.
 */
export function CinemaReelSection({ onExpandClick }: CinemaReelSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const soundRef = useRef<CoastalSoundscapeController | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Observe viewport visibility to pause inactive/offscreen video decoders
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInViewport(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Play active video only when in viewport and reduced-motion is off
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
  }, [activeIdx, inViewport, prefersReduced]);

  // Clean up synthesized coastal audio on unmount or scroll away
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

  const handleSelectChapter = (nextIdx: number) => {
    if (nextIdx === activeIdx || locked) return;
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
        paddingBlock: 'clamp(5rem, 10vw, 8.5rem)',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-editorial">
        {/* Section Header + Chapter Switcher Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.75rem',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              02 / MOTION ANTHOLOGY
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.35rem, 4.8vw, 4.15rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.025em',
                margin: '0.75rem 0 0 0',
              }}
            >
              Living Atmosphere of the Estate
            </h2>
          </div>

          {/* Multi-Video Chapter Tabs */}
          <div
            role="tablist"
            aria-label="Estate film chapters"
            className="glass-surface"
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              padding: '0.3rem',
              borderRadius: 'var(--radius-pill)',
              gap: '0.25rem',
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
                  onClick={() => handleSelectChapter(idx)}
                  style={{
                    position: 'relative',
                    padding: '0.6rem 1.15rem',
                    minHeight: '44px',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    background: 'transparent',
                    color: isSelected ? '#070A08' : 'var(--fg-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
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

        {/* Rounded 16:9 / 21:9 Cinema Stage */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            border: '1px solid var(--border-strong)',
            backgroundColor: '#050706',
            aspectRatio: '16 / 9',
            minHeight: '340px',
            boxShadow: '0 28px 70px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Stacked Crossfading Video Planes */}
          {CINEMA_CHAPTERS.map((chapter, idx) => {
            const isActive = idx === activeIdx;
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
                  src={chapter.videoSrc}
                  poster={chapter.posterSrc}
                  muted
                  loop
                  playsInline
                  preload={idx === 0 ? 'auto' : 'metadata'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            );
          })}

          {/* Bottom & Top Cinema Scrim */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg, rgba(7,10,8,0.52) 0%, transparent 28%, transparent 52%, rgba(7,10,8,0.88) 100%)',
            }}
          />

          {/* Top Cinema Chrome: Timecode + Soundscape + Fullscreen */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(1rem, 2.5vw, 1.75rem)',
              left: 'clamp(1rem, 2.5vw, 2rem)',
              right: 'clamp(1rem, 2.5vw, 2rem)',
              zIndex: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div
              className="glass-surface"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                }}
              />
              <span className="micro-label" style={{ fontSize: '0.6rem', color: 'var(--fg-primary)' }}>
                {activeChapter.specs}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
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
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.72rem',
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
                <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
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
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--fg-primary)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <Maximize2 size={13} color="#C6A15B" />
                <span className="cinema-expand-label">2.39:1 Theatre</span>
              </button>
            </div>
          </div>

          {/* Bottom Caption & Timecode */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(1.1rem, 3vw, 2.25rem)',
              left: 'clamp(1.1rem, 3vw, 2.25rem)',
              right: 'clamp(1.1rem, 3vw, 2.25rem)',
              zIndex: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
              style={{ maxWidth: '36rem' }}
            >
              <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                CHAPTER {activeChapter.index} · {activeChapter.timecode}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.65rem, 3vw, 2.5rem)',
                  fontWeight: 400,
                  margin: '0.35rem 0 0.4rem 0',
                  lineHeight: 1.05,
                }}
              >
                {activeChapter.title}
              </h3>
              <p
                className="cinema-caption-body"
                style={{
                  margin: 0,
                  color: 'var(--fg-secondary)',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                }}
              >
                {activeChapter.caption}
              </p>
            </motion.div>

            {/* Chapter Progress Indicators */}
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              {CINEMA_CHAPTERS.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Jump to ${c.title}`}
                  onClick={() => handleSelectChapter(idx)}
                  style={{
                    width: idx === activeIdx ? '36px' : '12px',
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
        @media (max-width: 640px) {
          .cinema-expand-label {
            display: none;
          }
          .cinema-caption-body {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
