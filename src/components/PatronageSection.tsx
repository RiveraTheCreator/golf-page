import { ArrowUpRight } from 'lucide-react';
import { AnimatedCounter, MagneticButton } from './motion/MotionPrimitives';

interface PatronageSectionProps {
  onApplyClick: () => void;
}

const METRICS = [
  { label: 'FOUNDING PATRONS CAP', target: 150, prefix: '', suffix: '', decimals: 0 },
  { label: 'TOURNAMENT GREEN STIMP', target: 12.5, prefix: '', suffix: '', decimals: 1 },
  { label: 'TEE-TIME BOTTLENECKS', target: 0, prefix: '', suffix: '', decimals: 0 },
  { label: 'PRIVATE ESTATE CAPITAL', target: 100, prefix: '$', suffix: 'M', decimals: 0 },
];

export function PatronageSection({ onApplyClick }: PatronageSectionProps) {
  return (
    <section
      id="patronage"
      style={{
        paddingBlock: 'clamp(5rem, 11vw, 9rem)',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-editorial">
        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            paddingBottom: 'clamp(3.5rem, 7vw, 5.5rem)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {METRICS.map((item) => (
            <div key={item.label}>
              <span className="micro-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                {item.label}
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 5.5vw, 4.75rem)',
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
            marginTop: 'clamp(3.5rem, 7vw, 5.5rem)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(2.25rem, 5vw, 4.5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
          }}
        >
          <div style={{ maxWidth: '38rem' }}>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              05 / FOUNDING PATRONAGE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.8vw, 4.1rem)',
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: '-0.025em',
                margin: '0.85rem 0 1.15rem 0',
              }}
            >
              Inquire for the 2026 Founding Cohort.
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--fg-secondary)',
                fontSize: '1rem',
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
            onClick={onApplyClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.05rem 2rem',
              minHeight: '52px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#070A08',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <span>Request Private Dossier</span>
            <ArrowUpRight size={17} strokeWidth={2.2} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
