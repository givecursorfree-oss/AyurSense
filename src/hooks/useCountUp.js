import { useEffect, useRef, useState } from 'react';
import { isMobileViewport, prefersReducedMotion } from '@/lib/scroll-motion';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Count-up without per-frame React setState (writes textContent directly).
 * @param {number} target
 * @param {{ duration?: number; decimals?: number; enabled?: boolean; threshold?: number }} [options]
 */
export function useCountUp(target, options = {}) {
  const {
    duration: durationOpt,
    decimals = 2,
    enabled = true,
    threshold = 0.2,
  } = options;

  const ref = useRef(null);
  const valueRef = useRef(null);
  const [ready, setReady] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const valueEl = valueRef.current;
    if (!el || !valueEl) return undefined;

    const format = (n) =>
      decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));

    if (!enabled || prefersReducedMotion()) {
      valueEl.textContent = format(target);
      setReady(true);
      return undefined;
    }

    const duration = durationOpt ?? (isMobileViewport() ? 900 : 1600);
    valueEl.textContent = format(0);
    setReady(true);

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        let startTime;
        const tick = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          valueEl.textContent = format(target * easeOutCubic(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, durationOpt, decimals, enabled, threshold]);

  return {
    ref,
    valueRef,
    formatted: ready ? undefined : decimals > 0 ? (0).toFixed(decimals) : '0',
  };
}
