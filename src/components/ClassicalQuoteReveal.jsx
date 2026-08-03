import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/scroll-motion';
import { SignComponent } from '@/components/SignComponent';

/** Classical Ayurvedic verse used as site wisdom quote */
const SANSKRIT_LINES = [
  'त्रय उपस्तम्भा इति - आहारः, स्वप्नो, ब्रह्मचर्यमिति;',
  'एभिस्त्रिभिर्युक्तियुक्तैरुपस्तब्धमुपस्तम्भैः शरीरं',
  'बलवर्णोपचयोपचितमनुवर्तते यावदायुः',
  'संस्कारात् संस्कारमहितमनुपसेवमानस्य, य इहैवोपदेक्ष्यते ॥३५॥',
];

const QUOTE_EN =
  'The three supporting pillars are food, sleep, and regulated conduct. When upheld with wise discipline, they sustain the body with strength, complexion, and growth for the span of life, provided one avoids regimens harmful to health.';

const ATTRIBUTION = 'Classical Ayurveda';

/**
 * Classical quote block - always fully readable.
 * Signature animates once when the section enters view.
 */
export function ClassicalQuoteReveal() {
  const sectionRef = useRef(null);
  const [sigPhase, setSigPhase] = useState('idle');

  useEffect(() => {
    if (prefersReducedMotion()) {
      setSigPhase('end');
      return undefined;
    }

    const el = sectionRef.current;
    if (!el) return undefined;

    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        setSigPhase('start');
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sigPhase !== 'start') return undefined;
    const t = window.setTimeout(() => setSigPhase('end'), 700);
    return () => window.clearTimeout(t);
  }, [sigPhase]);

  return (
    <section
      ref={sectionRef}
      id="classical-wisdom"
      className="classical-quote border-b border-light-steel"
      aria-labelledby="classical-quote-heading"
    >
      <div className="classical-quote__glow classical-quote__glow--ember" aria-hidden="true" />

      <div className="classical-quote__inner mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <p id="classical-quote-heading" className="text-label mb-6 text-center">
          Classical Ayurveda
        </p>
        <blockquote className="classical-quote__blockquote" lang="sa">
          <div
            className="classical-quote__sanskrit"
            aria-label="Classical Ayurvedic verse, Sanskrit"
          >
            {SANSKRIT_LINES.map((line) => (
              <p key={line} className="classical-quote__sanskrit-line">
                {line}
              </p>
            ))}
          </div>
          <div className="classical-quote__divider" aria-hidden="true" />
          <p className="classical-quote__text classical-quote__text--static font-display" lang="en">
            {QUOTE_EN}
          </p>
          <footer className="classical-quote__cite">
            <cite>{ATTRIBUTION}</cite>
          </footer>
        </blockquote>
        <div className="classical-quote__signature mt-8 flex justify-center">
          <SignComponent phase={sigPhase} />
        </div>
      </div>
    </section>
  );
}
