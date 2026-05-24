import { useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Full-screen preloader — Framer Astra Text Flow timing
 * "Ayur" uses brand gradient; "Sense" uses inkwell (matches app BrandName)
 */

const AYUR_LEN = 4;
const PRELOADER_TEXT = 'AyurSense';

const INITIAL_Y = [217, 164, 193, 165, 202, 172];
const LETTER_SPACING = ['-0.09em', '-0.05em', '-0.05em', '-0.02em', '-0.06em', '-0.09em'];

const EASE_IN = [0.44, 0, 0.56, 1];
const EASE_OUT = [0.44, 0, 0.18, 1];
const LETTER_DURATION = 0.4;
const LETTER_STAGGER = 0.2;
const HOLD_AFTER_REVEAL = 0.5;
const INITIAL_ROTATE = 14;

/** Clears legacy session flag from earlier builds (preloader now runs every visit). */
const LEGACY_PRELOADER_STORAGE_KEY = 'ayursense-preloader-done';

function getLargeFontSize() {
  return window.matchMedia('(max-width: 639px)').matches ? 95 : 215;
}

function getCompactFontSize() {
  return 47;
}

export function AstraPreloader({ onComplete }) {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    timelineRef.current?.kill();
    timelineRef.current = null;
    onCompleteRef.current?.();
  }, []);

  const handleSkip = useCallback(() => {
    finish();
  }, [finish]);

  useLayoutEffect(() => {
    try {
      sessionStorage.removeItem(LEGACY_PRELOADER_STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }

    const root = rootRef.current;
    if (!root) return undefined;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReduced) {
      finish();
      return undefined;
    }

    const letters = root.querySelectorAll('.astra-preloader-char');
    if (!letters.length) {
      finish();
      return undefined;
    }

    const largeSize = getLargeFontSize();
    const compactSize = getCompactFontSize();

    letters.forEach((el, i) => {
      gsap.set(el, {
        fontSize: largeSize,
        y: INITIAL_Y[i % INITIAL_Y.length],
        rotation: INITIAL_ROTATE,
        opacity: 0,
        transformOrigin: '50% 100%',
      });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: finish,
      });
      timelineRef.current = tl;

      tl.to(letters, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: LETTER_DURATION,
        ease: EASE_IN,
        stagger: LETTER_STAGGER,
      });

      tl.to({}, { duration: HOLD_AFTER_REVEAL });

      tl.to(letters, {
        fontSize: compactSize,
        duration: LETTER_DURATION,
        ease: EASE_IN,
      });

      tl.to({}, { duration: 0.35 });

      tl.to(root, {
        opacity: 0,
        duration: 0.45,
        ease: EASE_OUT,
      });
    }, root);

    return () => {
      ctx.revert();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [finish]);

  return (
    <div
      ref={rootRef}
      className="astra-preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading AyurSense"
    >
      <button
        type="button"
        className="astra-preloader__skip"
        onClick={handleSkip}
      >
        Skip intro
      </button>
      <div className="astra-preloader__texts">
        {[...PRELOADER_TEXT].map((char, i) => (
          <span
            key={`${char}-${i}`}
            className={`astra-preloader-char ${
              i < AYUR_LEN ? 'astra-preloader-char--ayur' : ''
            }`}
            style={{
              letterSpacing: LETTER_SPACING[i % LETTER_SPACING.length],
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
