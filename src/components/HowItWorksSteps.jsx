import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronRight } from '@/components/icons';
import { HOW_IT_WORKS_IMAGES, IMAGE_FALLBACK } from '@/data/media';

function HowItWorksStepImage({ src, alt }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={800}
      height={500}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== IMAGE_FALLBACK) setCurrentSrc(IMAGE_FALLBACK);
      }}
    />
  );
}

const STEPS = [
  {
    step: '01',
    title: 'Describe symptoms',
    body: 'Enter clinical signs, season, age, gender, and optional medications.',
    image: HOW_IT_WORKS_IMAGES.symptoms,
  },
  {
    step: '02',
    title: 'Run clinical analysis',
    body: 'AyurSense prepares dosha, herbs, formulation alignment, and safety flags for review.',
    image: HOW_IT_WORKS_IMAGES.inference,
  },
  {
    step: '03',
    title: 'Review the report',
    body: 'Export a structured report with citations and practitioner-facing safety notes.',
    image: HOW_IT_WORKS_IMAGES.report,
  },
];

export function HowItWorksSteps() {
  return (
    <section
      id="how-it-works"
      className="how-it-works section-block section-block--surface border-b border-light-steel scroll-mt-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="page-container">
        <div className="section-header how-it-works__header flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="how-it-works-heading" className="section-heading">
            Three steps to a{' '}
            <span className="section-heading__muted">clinical report</span>
          </h2>
          <Link to="/journey" className="btn-secondary shrink-0 self-start sm:self-auto">
            Open clinical journey
            <IconChevronRight size={16} className="btn-icon" aria-hidden />
          </Link>
        </div>

        <ol className="how-it-works__grid">
          {STEPS.map((item) => (
            <li key={item.step} className="how-it-works__card">
              <div className="how-it-works__media">
                <HowItWorksStepImage src={item.image.src} alt={item.image.alt} />
              </div>
              <span className="how-it-works__step font-data">{item.step}</span>
              <h3 className="how-it-works__title">{item.title}</h3>
              <p className="how-it-works__body text-body-sm">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
