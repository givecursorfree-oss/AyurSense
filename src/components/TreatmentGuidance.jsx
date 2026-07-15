import { getSymptomAwareTreatmentGuidance } from '@/data/dataset-v2-guidance';
import { expandBulletPoints } from '@/lib/bullet-text';
import { formatDoshaLabel, normalizeDoshas } from '@/data/natural-food-recommendations';

function GuidanceList({ items }) {
  const bullets = expandBulletPoints(items);

  if (!bullets.length) {
    return (
      <p className="treatment-guidance__empty text-sm text-dark-stone">
        No guidance available for this dosha profile.
      </p>
    );
  }

  return (
    <ul className="report-bullet-list treatment-guidance__list">
      {bullets.map((item) => (
        <li key={item} className="treatment-guidance__item">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TreatmentGuidance({ report }) {
  const parsedDoshas = normalizeDoshas(report.dosha);
  const alignedDoshas =
    parsedDoshas.length > 0 ? parsedDoshas : ['Vata', 'Pitta', 'Kapha'];

  const guidance = getSymptomAwareTreatmentGuidance({
    doshas: alignedDoshas,
    symptoms: report.symptoms,
    primaryMatch: report.enrichment?.primaryMatch,
  });

  const hasContent =
    guidance.dietLifestyle.length > 0 ||
    guidance.patientRecommendations.length > 0;

  if (!hasContent) return null;

  return (
    <section
      className="treatment-guidance report-section"
      aria-labelledby="treatment-guidance-heading"
    >
      <header className="treatment-guidance__header">
        <h3
          id="treatment-guidance-heading"
          className="font-display text-xl font-light tracking-tight text-inkwell md:text-2xl"
        >
          Treatment <span className="text-dark-stone">approaches</span>
        </h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-dark-stone">
          {guidance.fromSymptomMatch && guidance.matchedDisease ? (
            <>
              Guidance from dataset match:{' '}
              <strong className="font-medium text-inkwell">
                {guidance.matchedDisease}
              </strong>
              {' · '}Dosha:{' '}
              <strong className="font-medium text-inkwell">
                {alignedDoshas.map(formatDoshaLabel).join(', ')}
              </strong>
            </>
          ) : (
            <>
              Diet, lifestyle, and patient guidance aligned to{' '}
              <strong className="font-medium text-inkwell">
                {alignedDoshas.map(formatDoshaLabel).join(', ')}
              </strong>
            </>
          )}
          .
        </p>
      </header>

      <div className="treatment-guidance__grid">
        <article className="treatment-guidance__card">
          <h4 className="treatment-guidance__card-title">Diet &amp; lifestyle</h4>
          <GuidanceList items={guidance.dietLifestyle} />
        </article>
        <article className="treatment-guidance__card">
          <h4 className="treatment-guidance__card-title">Patient recommendations</h4>
          <GuidanceList items={guidance.patientRecommendations} />
        </article>
      </div>
    </section>
  );
}
