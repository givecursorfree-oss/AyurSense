import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { attachTextRevealScroll } from '@/lib/text-reveal-scroll';
import { SignComponent } from '@/components/SignComponent';

/** Charaka Samhita, Sūtrasthāna 11.35 (Tistraiṣaṇīya) */
const SANSKRIT_LINES = [
  'त्रय उपस्तम्भा इति — आहारः, स्वप्नो, ब्रह्मचर्यमिति;',
  'एभिस्त्रिभिर्युक्तियुक्तैरुपस्तब्धमुपस्तम्भैः शरीरं',
  'बलवर्णोपचयोपचितमनुवर्तते यावदायुः',
  'संस्कारात् संस्कारमहितमनुपसेवमानस्य, य इहैवोपदेक्ष्यते ॥३५॥',
];

const QUOTE_EN =
  'The three supporting pillars are food, sleep, and regulated conduct. When upheld with wise discipline, they sustain the body with strength, complexion, and growth for the span of life—provided one avoids regimens harmful to health.';

const ATTRIBUTION = 'Charaka Samhita · Sūtrasthāna 11.35';

/**
 * Classical quote with scroll text reveal; signature syncs to reveal progress.
 */
export function ClassicalQuoteReveal() {
  const textRef = useRef(null);
  const [sigPhase, setSigPhase] = useState('idle');

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduced) {
      setSigPhase('end');
      return undefined;
    }

    const cleanup = attachTextRevealScroll(el, {
      revealMode: 'words',
      startOffset: 95,
      endOffset: 50,
      dimOpacity: 0.72,
      dimColor: '#000000',
      litColor: '#000000',
      onProgress: (p) => {
        if (p >= 0.68) {
          setSigPhase((prev) => (prev === 'idle' ? 'start' : prev));
        }
        if (p >= 0.9) {
          setSigPhase('end');
        }
      },
    });

    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 200);

    return () => {
      window.clearTimeout(t);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (sigPhase !== 'start') return undefined;
    const t = window.setTimeout(() => {
      setSigPhase((prev) => (prev === 'start' ? 'end' : prev));
    }, 750);
    return () => window.clearTimeout(t);
  }, [sigPhase]);

  return (
    <section
      id="classical-wisdom"
      className="classical-quote border-b border-light-steel"
      aria-labelledby="classical-quote-heading"
    >
      <div className="classical-quote__glow classical-quote__glow--violet" aria-hidden="true" />
      <div className="classical-quote__glow classical-quote__glow--ember" aria-hidden="true" />

      <div className="classical-quote__inner mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        <p id="classical-quote-heading" className="text-label mb-6 text-center">
          Classical Ayurveda
        </p>
        <blockquote className="classical-quote__blockquote" lang="sa">
          <div className="classical-quote__sanskrit" aria-label="Charaka Samhita, verse 35, Sanskrit">
            {SANSKRIT_LINES.map((line) => (
              <p key={line} className="classical-quote__sanskrit-line">
                {line}
              </p>
            ))}
          </div>
          <div className="classical-quote__divider" aria-hidden="true" />
          <p ref={textRef} className="classical-quote__text font-display" lang="en">
            {QUOTE_EN}
          </p>
        </blockquote>
        <footer className="classical-quote__cite">
          <cite>{ATTRIBUTION}</cite>
        </footer>

        <div className="classical-quote__signature">
          <SignComponent phase={sigPhase} />
        </div>
      </div>
    </section>
  );
}
