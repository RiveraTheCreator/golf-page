import { useState } from 'react';
import { motion } from 'framer-motion';
import { EDITORIAL_EASE } from './motion/MotionPrimitives';

interface ClubProfile {
  id: string;
  label: string;
  ballSpeed: string;
  launchAngle: string;
  spinRate: string;
  carry: string;
  apex: string;
  pathD: string;
  apexPoint: { x: number; y: number };
}

const CLUB_PROFILES: ClubProfile[] = [
  {
    id: 'driver',
    label: 'Driver · 9.0°',
    ballSpeed: '182.4 mph',
    launchAngle: '11.8°',
    spinRate: '2,180 rpm',
    carry: '312 yds',
    apex: '104 ft',
    pathD: 'M 30 230 Q 290 25 560 225',
    apexPoint: { x: 295, y: 126 },
  },
  {
    id: 'iron7',
    label: 'Forged 7-Iron',
    ballSpeed: '134.8 mph',
    launchAngle: '16.4°',
    spinRate: '6,840 rpm',
    carry: '184 yds',
    apex: '98 ft',
    pathD: 'M 30 230 Q 250 18 440 225',
    apexPoint: { x: 242, y: 122 },
  },
  {
    id: 'wedge56',
    label: '56° Tour Wedge',
    ballSpeed: '89.2 mph',
    launchAngle: '28.5°',
    spinRate: '10,420 rpm',
    carry: '108 yds',
    apex: '82 ft',
    pathD: 'M 30 230 Q 190 42 325 225',
    apexPoint: { x: 184, y: 134 },
  },
];

export function TelemetrySection() {
  const [selectedId, setSelectedId] = useState<string>('driver');
  const activeClub = CLUB_PROFILES.find((c) => c.id === selectedId) ?? CLUB_PROFILES[0];

  return (
    <section
      id="telemetry"
      style={{
        paddingBlock: 'clamp(5rem, 10vw, 8.5rem)',
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
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <span className="micro-label" style={{ color: 'var(--accent-gold)' }}>
              04 / RADAR BALLISTICS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.3rem, 4.6vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: '-0.025em',
                margin: '0.75rem 0 0 0',
              }}
            >
              Tour-Grade Telemetry, Real-Time
            </h2>
          </div>

          {/* Club Selector Pills */}
          <div
            role="tablist"
            aria-label="Select golf club telemetry"
            className="glass-surface"
            style={{
              display: 'inline-flex',
              padding: '0.3rem',
              borderRadius: 'var(--radius-pill)',
              gap: '0.25rem',
            }}
          >
            {CLUB_PROFILES.map((club) => {
              const isSelected = club.id === selectedId;
              return (
                <button
                  key={club.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => setSelectedId(club.id)}
                  style={{
                    position: 'relative',
                    padding: '0.6rem 1.15rem',
                    minHeight: '44px',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    background: 'transparent',
                    color: isSelected ? '#070A08' : 'var(--fg-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    zIndex: 1,
                    transition: 'color 200ms var(--ease-ui)',
                  }}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="telemetry-tab-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--fg-primary)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  {club.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ballistic Trajectory + Metrics Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(1.5rem, 3.5vw, 3rem)',
          }}
        >
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <svg
              viewBox="0 0 600 250"
              width="100%"
              height="auto"
              role="img"
              aria-label={`Ballistic flight arc for ${activeClub.label}`}
              style={{ display: 'block', maxHeight: '290px' }}
            >
              {/* Baseline Turf Line */}
              <line
                x1="20"
                y1="226"
                x2="580"
                y2="226"
                stroke="rgba(243,239,230,0.16)"
                strokeWidth="1"
              />
              {/* Yardage Reference Ticks */}
              {[140, 260, 380, 500].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="220"
                  x2={x}
                  y2="232"
                  stroke="rgba(243,239,230,0.2)"
                  strokeWidth="1"
                />
              ))}

              {/* Animated Ballistic Arc */}
              <motion.path
                key={activeClub.id}
                d={activeClub.pathD}
                fill="none"
                stroke="#C6A15B"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.05, ease: EDITORIAL_EASE }}
              />

              {/* Apex Marker */}
              <motion.g
                key={`${activeClub.id}-apex`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.45, ease: EDITORIAL_EASE }}
              >
                <circle
                  cx={activeClub.apexPoint.x}
                  cy={activeClub.apexPoint.y}
                  r="5"
                  fill="#070A08"
                  stroke="#C6A15B"
                  strokeWidth="2"
                />
                <text
                  x={activeClub.apexPoint.x}
                  y={activeClub.apexPoint.y - 14}
                  textAnchor="middle"
                  fill="#8F9891"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  APEX {activeClub.apex}
                </text>
              </motion.g>
            </svg>
          </div>

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { label: 'BALL SPEED', value: activeClub.ballSpeed },
              { label: 'LAUNCH ANGLE', value: activeClub.launchAngle },
              { label: 'SPIN RATE', value: activeClub.spinRate },
              { label: 'CARRY DISTANCE', value: activeClub.carry, highlight: true },
            ].map((metric) => (
              <div key={metric.label}>
                <span className="micro-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {metric.label}
                </span>
                <motion.span
                  key={`${activeClub.id}-${metric.label}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
                    fontWeight: 500,
                    color: metric.highlight ? 'var(--accent-gold)' : 'var(--fg-primary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {metric.value}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
