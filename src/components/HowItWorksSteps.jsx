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
    body: 'Enter clinical signs, season, age, and gender in a structured intake form.',
    image: HOW_IT_WORKS_IMAGES.symptoms,
  },
  {
    step: '02',
    title: 'Run AyurGenix V9',
    body: 'IndicBERTv2 + LoRA infers dosha, severity, herbs, interactions, and dosage in one pass.',
    image: HOW_IT_WORKS_IMAGES.inference,
  },
  {
    step: '03',
    title: 'Review the report',
    body: 'Export or print a structured report with classical formulation alignment and safety flags.',
    image: HOW_IT_WORKS_IMAGES.report,
  },
];

export function HowItWorksSteps() {
  return (
    <section
      id="how-it-works"
      className="how-it-works border-b border-light-steel bg-cloud-gray scroll-mt-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="page-container py-12 sm:py-14 md:py-16">
        <p className="text-label mb-3">Three steps</p>
        <div className="how-it-works__header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="how-it-works-heading"
            className="font-display max-w-xl text-[clamp(1.5rem,4vw,2.25rem)] font-light leading-tight tracking-tight text-inkwell md:text-4xl"
          >
            Three steps to a{' '}
            <span className="text-dark-stone">clinical report</span>
          </h2>
          <Link to="/journey" className="btn-secondary shrink-0 self-start sm:self-auto">
            Learn more about the path
            <IconChevronRight size={16} className="btn-icon" aria-hidden />
          </Link>
        </div>

        <ol className="how-it-works__grid mt-10">
          {STEPS.map((item) => (
            <li key={item.step} className="how-it-works__card">
              <div className="how-it-works__media">
                <HowItWorksStepImage src={item.image.src} alt={item.image.alt} />
              </div>
              <span className="how-it-works__step font-data">{item.step}</span>
              <h3 className="how-it-works__title">{item.title}</h3>
              <p className="how-it-works__body text-body-copy">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
