import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { CINEMA_CHAPTERS } from '../data/cinemaChapters';
import {
  EDITORIAL_EASE,
  useModalLifecycle,
  usePrefersReducedMotion,
} from './motion/motionHooks';
import {
  startCoastalSoundscape,
  type CoastalSoundscapeController,
} from '../utils/coastalAudio';

interface EstateFilmModalProps {
  isOpen: boolean;
  initialChapter?: number;
  onClose: () => void;
  onApplyClick: () => void;
}

interface TheatreContentProps {
  initialChapter: number;
  onClose: () => void;
  onApplyClick: () => void;
}

function EstateFilmTheatre({
  initialChapter,
  onClose,
  onApplyClick,
}: TheatreContentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundRef = useRef<CoastalSoundscapeController | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [chapterIdx, setChapterIdx] = useState(initialChapter);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReduced);
  const [soundOn, setSoundOn] = useState(false);

  useModalLifecycle(true, onClose);

  useEffect(() => {
    if (!soundOn || !isPlaying) {
      soundRef.current?.stop();
      soundRef.current = null;
      return;
    }
    soundRef.current = startCoastalSoundscape();
    return () => {
      soundRef.current?.stop();
      soundRef.current = null;
    };
  }, [soundOn, isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    if (isPlaying && !prefersReduced) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [chapterIdx, isPlaying, prefersReduced]);

  const activeChapter = CINEMA_CHAPTERS[chapterIdx] ?? CINEMA_CHAPTERS[0];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Aurelia Estate Anamorphic Showreel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        backgroundColor: 'rgba(4, 6, 5, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1220px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Theatre Top Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              AURELIA® CINEMA · 2.39:1 ANAMORPHIC REEL
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
                fontWeight: 400,
                margin: '0.2rem 0 0 0',
              }}
            >
              {activeChapter.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
              onClick={() => setIsPlaying((p) => !p)}
              className="glass-surface-interactive"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-primary)',
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              type="button"
              aria-label={soundOn ? 'Mute ambient audio' : 'Enable ambient audio'}
              aria-pressed={soundOn}
              onClick={() => setSoundOn((s) => !s)}
              className="glass-surface-interactive"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0 1rem',
                height: '44px',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--fg-primary)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {soundOn ? (
                <Volume2 size={15} color="#C6A15B" />
              ) : (
                <VolumeX size={15} color="#8F9891" />
              )}
              <span>{soundOn ? 'Soundscape On' : 'Soundscape Off'}</span>
            </button>

            <button
              type="button"
              aria-label="Close showreel theatre"
              onClick={onClose}
              className="glass-surface-interactive"
              style={{
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
        </div>

        {/* Letterboxed 2.39:1 Viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '2.35 / 1',
            minHeight: '260px',
            borderRadius: '22px',
            overflow: 'hidden',
            border: '1px solid var(--border-strong)',
            backgroundColor: '#000',
          }}
        >
          <video
            key={activeChapter.videoSrc}
            ref={videoRef}
            src={activeChapter.videoSrc}
            poster={activeChapter.posterSrc}
            muted
            playsInline
            autoPlay={!prefersReduced}
            onEnded={() => setChapterIdx((prev) => (prev + 1) % CINEMA_CHAPTERS.length)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 25%, transparent 72%, rgba(0,0,0,0.68) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1.35rem',
              right: '1.35rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span className="micro-label" style={{ fontSize: '0.62rem', color: 'var(--fg-primary)' }}>
              {activeChapter.specs}
            </span>
            <span className="micro-label" style={{ fontSize: '0.62rem', color: 'var(--accent-gold)' }}>
              {activeChapter.timecode}
            </span>
          </div>
        </div>

        {/* Chapter Switcher + Direct Inquiry Footer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CINEMA_CHAPTERS.map((chap, idx) => {
              const active = idx === chapterIdx;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setChapterIdx(idx)}
                  className="glass-surface-interactive"
                  style={{
                    padding: '0.55rem 1rem',
                    minHeight: '44px',
                    borderRadius: 'var(--radius-pill)',
                    borderColor: active ? 'var(--accent-gold)' : undefined,
                    color: active ? 'var(--fg-primary)' : 'var(--fg-muted)',
                    fontSize: '0.8rem',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {chap.tabLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onApplyClick();
            }}
            style={{
              padding: '0.7rem 1.4rem',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#070A08',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            Inquire for Private Tour
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EstateFilmModal({
  isOpen,
  initialChapter = 0,
  onClose,
  onApplyClick,
}: EstateFilmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <EstateFilmTheatre
          key={`theatre-${initialChapter}`}
          initialChapter={initialChapter}
          onClose={onClose}
          onApplyClick={onApplyClick}
        />
      )}
    </AnimatePresence>
  );
}
