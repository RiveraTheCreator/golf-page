import { ArrowDown } from 'lucide-react';

export function CourseTicker() {
  return (
    <div
      style={{
        backgroundColor: '#0A0E0C',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBlock: '1.35rem',
      }}
    >
      <div
        className="container-editorial"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span className="micro-label" style={{ color: 'var(--fg-primary)' }}>
          EST. <span style={{ color: 'var(--fg-muted)' }}>2026</span>
        </span>

        <a
          href="#sanctuary"
          className="micro-label"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'var(--fg-primary)',
          }}
        >
          <span>SCROLL TO EXPLORE</span>
          <span
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid var(--border-strong)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDown size={13} color="#C6A15B" />
          </span>
        </a>

        <span className="micro-label">TOUR-GRADE BIOMECHANICS</span>
      </div>
    </div>
  );
}
