import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const MANIFESTO_WORDS =
  'We believe great golf is not rushed through crowded tee sheets. Every contour, every bunker, and every millisecond of swing telemetry at Aurelia is engineered for players who measure legacy in precision.'.split(
    ' '
  );

interface WordProps {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}

function ManifestoWord({ word, range, progress }: WordProps) {
  const color = useTransform(progress, range, ['#3A423D', '#F3EFE6']);
  return (
    <motion.span
      style={{
        color,
        display: 'inline-block',
        marginRight: '0.28em',
        willChange: 'color',
      }}
    >
      {word}
    </motion.span>
  );
}

export function ManifestoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.78', 'end 0.35'],
  });

  return (
    <section
      id="sanctuary"
      ref={containerRef}
      style={{
        paddingBlock: 'clamp(6rem, 13vw, 11rem)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div
        className="container-editorial"
        style={{
          maxWidth: '940px',
          textAlign: 'center',
        }}
      >
        <span
          className="micro-label"
          style={{
            display: 'inline-block',
            marginBottom: '2rem',
            color: 'var(--accent-gold)',
          }}
        >
          00 / THE PHILOSOPHY
        </span>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem, 3.9vw, 3.35rem)',
            lineHeight: 1.24,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            margin: 0,
          }}
        >
          {MANIFESTO_WORDS.map((word, index) => {
            const start = index / MANIFESTO_WORDS.length;
            const end = Math.min(start + 3 / MANIFESTO_WORDS.length, 1);
            return (
              <ManifestoWord
                key={`${word}-${index}`}
                word={word}
                range={[start, end]}
                progress={scrollYProgress}
              />
            );
          })}
        </p>

        <p
          style={{
            marginTop: '3.5rem',
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            color: 'var(--fg-muted)',
            fontWeight: 300,
          }}
        >
          No tee-time lotteries. No corporate outings.{' '}
          <span style={{ color: 'var(--fg-primary)', fontWeight: 400 }}>
            Pure championship architecture, reserved for 150.
          </span>
        </p>
      </div>
    </section>
  );
}
