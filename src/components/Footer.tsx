import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'clamp(3rem, 6vw, 4rem)',
        paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="container-editorial">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          <div>
            <span className="micro-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              LOCATION
            </span>
            <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: '0.92rem' }}>
              Cypress Ridge Road, Monterey Peninsula, CA
            </p>
          </div>

          <div>
            <span className="micro-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              PRIVATE CONCIERGE
            </span>
            <a
              href="mailto:concierge@aurelialinks.com"
              style={{ color: 'var(--fg-primary)', fontSize: '0.92rem' }}
            >
              concierge@aurelialinks.com
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="glass-surface"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--fg-primary)',
              fontSize: '0.8rem',
            }}
          >
            <span>Top</span>
            <ArrowUp size={14} color="#C6A15B" />
          </button>
        </div>

        {/* Giant Editorial Ghost Wordmark */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 16vw, 14rem)',
            fontWeight: 400,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: 'rgba(243, 239, 230, 0.06)',
            userSelect: 'none',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          AURELIA®
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <span className="micro-label">© 2026 AURELIA LINKS &amp; PERFORMANCE LAB</span>
          <span className="micro-label">ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
