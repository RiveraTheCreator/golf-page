import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion';
import { EDITORIAL_EASE, usePrefersReducedMotion } from './motionHooks';

export function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--accent-gold)',
        transformOrigin: '0% 50%',
        scaleX,
        zIndex: 100,
      }}
    />
  );
}

export function GrainOverlay() {
  return (
    <svg className="grain-overlay" aria-hidden="true">
      <filter id="aurelia-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.78"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#aurelia-grain)" />
    </svg>
  );
}

interface MaskedLineProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MaskedLine({ children, delay = 0, className }: MaskedLineProps) {
  return (
    <span
      style={{
        display: 'block',
        overflow: 'hidden',
        paddingBottom: '0.08em',
        marginBottom: '-0.08em',
      }}
    >
      <motion.span
        className={className}
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '110%', opacity: 0.001 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          duration: 1.05,
          delay,
          ease: EDITORIAL_EASE,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  strength = 0.28,
  style,
  onClick,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      prefersReduced ||
      window.matchMedia('(hover: none)').matches ||
      !ref.current
    ) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1400,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReduced) return;

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, prefersReduced, target, duration]);

  const resolvedValue = prefersReduced && isInView ? target : displayValue;

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {resolvedValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
