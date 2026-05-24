/**
 * Professional clinical journey — vertical path + article cards (no pinned skiper scroll).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ST_SCRUB_SMOOTH, scheduleScrollRefresh } from '@/lib/scroll-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { AYURVEDA_PATH_NODES } from '@/data/ayurveda-path-nodes';

gsap.registerPlugin(ScrollTrigger);

function PipelineCard({ node }) {
  return (
    <article className="path-card path-card--pipeline">
      <span className="path-card__step font-data">{node.step}</span>
      <h3 className="path-card__title">{node.title}</h3>
      <p className="path-card__teaser">{node.teaser}</p>
    </article>
  );
}

function ArticleCard({ node, expanded, onToggle }) {
  const isOpen = expanded === node.id;

  return (
    <article className={`path-card path-card--tip ${isOpen ? 'path-card--open' : ''}`}>
      <button
        type="button"
        className="path-card__hit"
        onClick={() => onToggle(isOpen ? null : node.id)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? `journey-panel-${node.id}` : undefined}
      >
        {node.image && (
          <div className="path-card__media">
            <img
              src={node.image}
              alt={node.imageAlt || 'Clinical insight'}
              loading="lazy"
              decoding="async"
            />
            <span className="path-card__badge text-label">Clinical insight</span>
          </div>
        )}
        <div className="path-card__content">
          <span className="path-card__step font-data">{node.step}</span>
          <h3 className="path-card__title">{node.title}</h3>
          <p className="path-card__teaser">{node.teaser}</p>
          <span className="path-card__action">
            {isOpen ? 'Collapse article' : 'Read full guidance'}
          </span>
        </div>
      </button>

      {isOpen && node.article && (
        <div
          id={`journey-panel-${node.id}`}
          className="path-card__panel"
          role="region"
          aria-label={`${node.title} guidance`}
        >
          <p className="path-card__article">{node.article}</p>
          {(node.dos?.length || node.donts?.length) && (
            <div className="path-card__lists">
              {node.dos?.length > 0 && (
                <div className="path-card__list path-card__list--do">
                  <h4 className="text-label">Recommended</h4>
                  <ul>
                    {node.dos.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {node.donts?.length > 0 && (
                <div className="path-card__list path-card__list--dont">
                  <h4 className="text-label">Avoid</h4>
                  <ul>
                    {node.donts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function ClinicalJourney() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scheduleScrollRefresh();
      return undefined;
    }

    const section = sectionRef.current;
    const fill = fillRef.current;
    const track = trackRef.current;
    if (!section || !fill || !track) return;

    let refreshTimer;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: ST_SCRUB_SMOOTH,
          },
        }
      );

      gsap.utils.toArray('.path-row').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      scheduleScrollRefresh();
      refreshTimer = window.setTimeout(() => scheduleScrollRefresh(), 400);
    }, section);

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="clinical-journey"
      ref={sectionRef}
      className="clinical-path-scroll scroll-mt-24"
      aria-labelledby="journey-heading"
    >
      <header className="clinical-path-scroll__header page-container py-10 sm:py-12 md:py-16">
        <p className="text-label mb-3">Clinical path</p>
        <h2
          id="journey-heading"
          className="font-display max-w-2xl text-[clamp(1.5rem,4vw,2.25rem)] font-light leading-tight tracking-tight text-inkwell md:text-4xl"
        >
          From daily rhythm to{' '}
          <span className="text-dark-stone">clinical report</span>
        </h2>
        <p className="clinical-path-scroll__lede mt-4">
          Follow the inference path below — Ayurvedic context articles alternate with
          pipeline stages until you reach{' '}
          <span className="path-intake-word font-medium text-inkwell">patient intake</span>.
        </p>
      </header>

      <div className="page-container clinical-path-scroll__track-wrap pb-16 md:pb-20">
        <div ref={trackRef} className="path-track">
          <div className="path-track__line" aria-hidden="true">
            <div className="path-track__line-bg" />
            <div ref={fillRef} className="path-track__line-fill" />
          </div>

          <div className="path-track__rows">
            {AYURVEDA_PATH_NODES.map((node) => (
              <div key={node.id} className="path-row">
                <div className="path-row__rail" aria-hidden="true">
                  <span className="path-row__dot" />
                </div>
                <div className="path-row__card">
                  {node.type === 'pipeline' ? (
                    <PipelineCard node={node} />
                  ) : (
                    <ArticleCard
                      node={node}
                      expanded={expandedId}
                      onToggle={setExpandedId}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="path-row">
              <div className="path-row__rail" aria-hidden="true">
                <span className="path-row__dot path-row__dot--end" />
              </div>
              <div className="path-row__card">
                <div className="path-terminus__card">
                  <p className="text-label">Ready</p>
                  <h3 className="path-terminus__title">
                    Start your <span className="accent-gradient-text">clinical</span>{' '}
                    analysis
                  </h3>
                  <p className="path-terminus__hint text-body-copy">
                    Enter symptoms, season, age, and gender. AyurSense via AyurGenix V9
                    returns dosha, herbs, classical formulation alignment, and interaction
                    screening in one pass.
                  </p>
                  <PrimaryCtaLink className="path-terminus__cta w-full sm:w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
