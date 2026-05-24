import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * @param {number} target
 * @param {{ duration?: number; decimals?: number; enabled?: boolean; threshold?: number }} [options]
 */
export function useCountUp(target, options = {}) {
  const {
    duration = 2000,
    decimals = 2,
    enabled = true,
    threshold = 0.25,
  } = options;

  const ref = useRef(null);
  const [display, setDisplay] = useState(enabled ? 0 : target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setDisplay(target);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    let frame;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        let startTime;

        const tick = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setDisplay(target * easeOutCubic(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, enabled, threshold]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));

  return { ref, formatted, raw: display };
}
