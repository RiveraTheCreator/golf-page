import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { EDITORIAL_EASE, useModalLifecycle } from './motion/motionHooks';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTEREST_CHIPS = [
  'Founding Individual',
  'Family Office Syndicate',
  'Helicopter Arrival (MRY)',
  'Tour Lab Baseline',
];

export function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handicap, setHandicap] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Founding Individual',
  ]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      setSubmitted(false);
      setError('');
    }, 300);
  }, [onClose]);

  useModalLifecycle(isOpen, handleClose);

  const toggleChip = (chip: string) => {
    setSelectedInterests((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@')) {
      setError('Please enter your full name and a valid private email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(7, 10, 8, 0.84)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto',
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="patronage-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '24px',
              padding: 'clamp(1.65rem, 4vw, 2.6rem)',
              position: 'relative',
            }}
          >
            <button
              id="inquiry-modal-close-btn"
              type="button"
              aria-label="Close patronage inquiry"
              onClick={handleClose}
              className="glass-surface-interactive"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
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

            {!submitted ? (
              <>
                <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
                  FOUNDING COHORT · 2026
                </span>
                <h3
                  id="patronage-modal-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.25rem',
                    fontWeight: 400,
                    margin: '0.5rem 0 0.65rem 0',
                  }}
                >
                  Request Private Dossier
                </h3>
                <p
                  style={{
                    color: 'var(--fg-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.55,
                    margin: '0 0 1.5rem 0',
                  }}
                >
                  Submissions are reviewed directly by the Aurelia Membership
                  Committee within 48 hours.
                </p>

                <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '1.1rem' }}>
                  {/* Selectable Patronage Chips with Spring Check */}
                  <div>
                    <span
                      className="micro-label"
                      style={{ display: 'block', marginBottom: '0.55rem' }}
                    >
                      PATRONAGE PREFERENCES
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {INTEREST_CHIPS.map((chip) => {
                        const active = selectedInterests.includes(chip);
                        return (
                          <motion.button
                            key={chip}
                            type="button"
                            aria-pressed={active}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => toggleChip(chip)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.85rem',
                              minHeight: '38px',
                              borderRadius: 'var(--radius-pill)',
                              border: active
                                ? '1px solid var(--accent-gold)'
                                : '1px solid var(--border-strong)',
                              backgroundColor: active
                                ? 'var(--accent-gold-soft)'
                                : 'var(--bg-primary)',
                              color: active ? 'var(--fg-primary)' : 'var(--fg-muted)',
                              fontSize: '0.78rem',
                              fontWeight: 500,
                              transition:
                                'border-color 180ms var(--ease-ui), background-color 180ms var(--ease-ui)',
                            }}
                          >
                            {active && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                                style={{ display: 'inline-flex' }}
                              >
                                <Check size={13} color="#C6A15B" />
                              </motion.span>
                            )}
                            <span>{chip}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="patron-name"
                      className="micro-label"
                      style={{ display: 'block', marginBottom: '0.42rem' }}
                    >
                      FULL NAME
                    </label>
                    <input
                      id="patron-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Vance"
                      required
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        minHeight: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--fg-primary)',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.9rem',
                    }}
                  >
                    <div>
                      <label
                        htmlFor="patron-email"
                        className="micro-label"
                        style={{ display: 'block', marginBottom: '0.42rem' }}
                      >
                        PRIVATE EMAIL
                      </label>
                      <input
                        id="patron-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="a.vance@familyoffice.com"
                        required
                        style={{
                          width: '100%',
                          padding: '0.82rem 1rem',
                          minHeight: '46px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-strong)',
                          color: 'var(--fg-primary)',
                          fontSize: '0.95rem',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="patron-handicap"
                        className="micro-label"
                        style={{ display: 'block', marginBottom: '0.42rem' }}
                      >
                        USGA INDEX (OPTIONAL)
                      </label>
                      <input
                        id="patron-handicap"
                        type="text"
                        value={handicap}
                        onChange={(e) => setHandicap(e.target.value)}
                        placeholder="+1.4"
                        style={{
                          width: '100%',
                          padding: '0.82rem 1rem',
                          minHeight: '46px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-strong)',
                          color: 'var(--fg-primary)',
                          fontSize: '0.95rem',
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" style={{ margin: 0, color: '#E57373', fontSize: '0.85rem' }}>
                      {error}
                    </p>
                  )}

                  <button
                    id="inquiry-submit-btn"
                    type="submit"
                    style={{
                      marginTop: '0.35rem',
                      padding: '0.95rem 1.5rem',
                      minHeight: '48px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#070A08',
                      border: 'none',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                    }}
                  >
                    Submit Confidential Inquiry
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', paddingBlock: '1.5rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold-soft)',
                    border: '1px solid var(--accent-gold)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Check size={24} color="#C6A15B" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 400,
                    margin: '0 0 0.75rem 0',
                  }}
                >
                  Dossier Request Received
                </h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
                  Thank you, {name}. Our Membership Director will dispatch the
                  encrypted prospectus ({selectedInterests.join(' · ') || 'Founding Cohort'}) to{' '}
                  <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="glass-surface-interactive"
                  style={{
                    padding: '0.75rem 1.5rem',
                    minHeight: '44px',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--fg-primary)',
                    fontSize: '0.88rem',
                  }}
                >
                  Return to Sanctuary
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
