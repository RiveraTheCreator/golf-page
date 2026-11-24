import { ArrowUpRight } from 'lucide-react';
import { AnimatedCounter, MagneticButton } from './motion/MotionPrimitives';

interface PatronageSectionProps {
  onApplyClick: () => void;
}

const METRICS = [
  { label: 'PATRONS CAP', target: 150, prefix: '', suffix: '', decimals: 0 },
  { label: 'GREEN STIMP', target: 12.5, prefix: '', suffix: '', decimals: 1 },
  { label: 'TEE BOTTLENECKS', target: 0, prefix: '', suffix: '', decimals: 0 },
  { label: 'ESTATE CAPITAL', target: 100, prefix: '$', suffix: 'M', decimals: 0 },
];

export function PatronageSection({ onApplyClick }: PatronageSectionProps) {
  return (
    <section
      id="patronage"
      style={{
        paddingBlock: 'clamp(4.25rem, 11vw, 9rem)',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-editorial">
        {/* 4-Column Desktop -> Crisp 2x2 Mobile Metrics Grid */}
        <div
          className="metrics-grid-responsive"
          style={{
            paddingBottom: 'clamp(3rem, 7vw, 5.5rem)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {METRICS.map((item) => (
            <div key={item.label}>
              <span
                className="micro-label"
                style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.6rem' }}
              >
                {item.label}
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.65rem, 5.5vw, 4.75rem)',
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: 'var(--fg-primary)',
                }}
              >
                <AnimatedCounter
                  target={item.target}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  decimals={item.decimals}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Founding Patronage CTA Panel */}
        <div
          style={{
            marginTop: 'clamp(3rem, 7vw, 5.5rem)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(1.75rem, 5vw, 4.5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '38rem' }}>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              05 / FOUNDING PATRONAGE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.15rem, 4.8vw, 4.1rem)',
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: '-0.025em',
                margin: '0.75rem 0 1rem 0',
              }}
            >
              Inquire for the 2026 Founding Cohort.
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--fg-secondary)',
                fontSize: 'clamp(0.92rem, 1.2vw, 1rem)',
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Patronage is by invitation or private committee review. Submit an
              expression of interest to receive the architectural prospectus and
              schedule a private helicopter or coastal site tour.
            </p>
          </div>

          <MagneticButton
            id="patronage-request-dossier-btn"
            onClick={onApplyClick}
            className="patronage-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.7rem',
              padding: '1rem 1.9rem',
              minHeight: '52px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#070A08',
              border: 'none',
              fontSize: '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <span>Request Private Dossier</span>
            <ArrowUpRight size={17} strokeWidth={2.2} className="cta-arrow-disc" />
          </MagneticButton>
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) {
          .patronage-cta-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
