import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { copyReportMarkdown } from '@/lib/report-export';
import { downloadAyurvedicPrescriptionPdf } from '@/lib/prescription-pdf';
import { isMeaningfulLabel } from '@/lib/parse-clinical-report';
import {
  METRICS_CAVEAT,
  MODEL_NAME,
  PRODUCT_NAME,
} from '@/data/brand-copy';
import { DietPlan } from '@/components/DietPlan';
import { TreatmentGuidance } from '@/components/TreatmentGuidance';
import { ClinicalSafetyBanner } from '@/components/ClinicalSafetyBanner';
import {
  filterDisplayFoods,
  formatDoshaLabel,
  getRecommendedNaturalFoods,
  isKoshaAliasFood,
  normalizeDoshas,
} from '@/data/natural-food-recommendations';

const METRICS = [
  { key: 'dosha', label: 'Dosha imbalance' },
  { key: 'severity', label: 'Symptom severity' },
  { key: 'toxicity', label: 'Toxicity risk' },
  { key: 'sideEffects', label: 'Possible side-effects' },
  { key: 'dosage', label: 'Dosage estimate (model)' },
];

function MetricTile({ label, value }) {
  return (
    <div className="report-metric">
      <div className="report-metric__glow" aria-hidden="true" />
      <div className="relative z-[1]">
        <p className="report-metric__label">{label}</p>
        <p className="report-metric__value font-display">{value}</p>
      </div>
    </div>
  );
}

function SafetyTile({ safety, needsReview }) {
  return (
    <div
      className={`report-metric report-metric--safety ${
        needsReview ? 'report-metric--danger' : 'report-metric--safe'
      }`}
    >
      <div className="report-metric__glow" aria-hidden="true" />
      <div className="relative z-[1]">
        <p className="report-metric__label">Drug safety</p>
        <p
          className={`report-metric__value font-display ${
            needsReview ? 'report-metric__value--alert' : 'report-metric__value--clear'
          }`}
        >
          {safety}
        </p>
      </div>
    </div>
  );
}

function interactionTone(tag) {
  if (tag === 'DANGER') return 'danger';
  if (tag === 'WARN') return 'warn';
  return 'safe';
}

export function ClinicalReport({ report, reportRef }) {
  const [copyState, setCopyState] = useState('idle');
  const [pdfState, setPdfState] = useState('idle');

  const parsedDoshas = normalizeDoshas(report.dosha);
  // Fallback: always show a complete dosha-aligned prescription.
  const alignedDoshas =
    parsedDoshas.length > 0 ? parsedDoshas : ['Vata', 'Pitta', 'Kapha'];
  const foodRecommendations = getRecommendedNaturalFoods({
    doshas: alignedDoshas,
  });

  const enrichment = report.enrichment ?? {};
  const primaryMatch = enrichment.primaryMatch;
  const formulationMeta = enrichment.formulationMeta ?? {};
  const doshaNote = enrichment.doshaRefined?.note;

  const needsReview =
    /CONFLICT|CAUTION/i.test(report.safety ?? '') &&
    !/no conflict/i.test(report.safety ?? '');

  const handleCopy = async () => {
    try {
      await copyReportMarkdown(report);
      setCopyState('done');
      window.setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
    }
  };

  const handleDownloadPdf = async () => {
    setPdfState('loading');
    try {
      await downloadAyurvedicPrescriptionPdf({
        patient: report.patient,
        age: report.age,
        gender: report.gender,
        season: report.season,
        doshaText: report.dosha,
        symptoms: report.symptoms,
        severity: report.severity,
        safeDosage: report.dosage,
        toxicity: report.toxicity,
        sideEffects: report.sideEffects,
        drugSafety: report.safety,
        herbs: report.herbs,
        formulation: report.formulation,
        foodRecommendations,
        enrichment,
        primaryMatch,
        formulationMeta,
      });
      setPdfState('done');
      window.setTimeout(() => setPdfState('idle'), 2500);
    } catch (e) {
      console.error(e);
      setPdfState('error');
    }
  };

  return (
    <section
      id="report"
      ref={reportRef}
      className="report-panel scroll-mt-24 report-panel--printable"
    >
      <div className="report-panel__shell">
        <header className="report-panel__header">
          <div>
            <p className="text-label mb-2">Clinical output</p>
            <h2 className="font-display text-3xl font-light tracking-tight text-inkwell md:text-4xl">
              Clinical <span className="text-dark-stone">report</span>
            </h2>
            <p className="mt-2 text-body-sm max-w-[40rem]">
              {PRODUCT_NAME} · {MODEL_NAME}. Neural inference, citation-backed
              formulations, herb-herb safety screening.
            </p>
            <div className="report-export-actions mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary btn-secondary--sm" onClick={handleCopy}>
                {copyState === 'done' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy markdown'}
              </button>
              <button
                type="button"
                className="btn-secondary btn-secondary--sm"
                onClick={handleDownloadPdf}
                disabled={pdfState === 'loading'}
              >
                {pdfState === 'loading'
                  ? 'Generating PDF…'
                  : pdfState === 'done'
                    ? 'Downloaded'
                    : pdfState === 'error'
                      ? 'PDF failed'
                      : 'Download prescription PDF'}
              </button>
            </div>
            {(report.patient !== 'N/A' || report.symptoms !== 'N/A') && (
              <dl className="report-patient-meta mt-4 grid gap-2 text-sm">
                {report.patient !== 'N/A' && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-dark-stone">Patient</dt>
                    <dd className="font-medium text-inkwell">{report.patient}</dd>
                  </div>
                )}
                {report.symptoms !== 'N/A' && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-dark-stone">Symptoms</dt>
                    <dd className="text-inkwell">{report.symptoms}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <span
            className={`report-status-pill ${
              needsReview ? 'report-status-pill--warn' : 'report-status-pill--ok'
            }`}
          >
            {needsReview ? 'Review required' : 'Analysis complete'}
          </span>
        </header>

        <aside className="report-limits-callout" role="note">
          <p className="text-sm text-inkwell">
            Educational CDS only - not a prescription. Practitioner review
            required.
          </p>
          <p className="mt-2 text-xs text-dark-stone">{METRICS_CAVEAT}</p>
          <p className="mt-2">
            <Link to="/limitations" className="text-sm text-ember-orange underline-offset-2 hover:underline">
              Read full limitations &amp; ethics
            </Link>
          </p>
        </aside>

        <ClinicalSafetyBanner redFlags={enrichment.redFlags} />

        <div className="report-bento">
          <SafetyTile safety={report.safety} needsReview={needsReview} />
          {METRICS.map(({ key, label }) => (
            <MetricTile key={key} label={label} value={report[key]} />
          ))}
        </div>

        {primaryMatch && (
          <div className="report-match-card report-section">
            <p className="text-label text-dark-stone">Dataset condition match</p>
            <p className="mt-1 font-display text-xl font-light text-inkwell">
              {primaryMatch.disease}
            </p>
            <p className="mt-2 text-sm text-dark-stone">
              {primaryMatch.symptoms}
            </p>
            <p className="mt-2 text-xs text-dark-stone">
              Match strength: {primaryMatch.matchPercent}% · used to refine dosha,
              treatment, and herb context when confidence is high
            </p>
          </div>
        )}

        {doshaNote && enrichment.doshaRefined?.confidence !== 'high' && (
          <p className="report-refinement-note text-sm text-dark-stone">
            Dosha note: {doshaNote}
          </p>
        )}

        <div className="report-section">
          <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
            Recommended botanical profile
          </h3>
          <p className="mt-1 text-sm text-dark-stone">
            {report.herbs.length} herbs after confidence screening
            {enrichment.herbThresholdPercent
              ? ` (≥${enrichment.herbThresholdPercent}% model confidence)`
              : ''}
          </p>
          <div className="report-herb-grid mt-4">
            {report.herbs.map((herb, i) => {
              const showCanonical = isMeaningfulLabel(herb.canonical);

              return (
              <article key={i} className="report-herb-card report-herb-card--rich">
                <div className="report-herb-card__head">
                  <div className="min-w-0 flex-1">
                    <p className="report-herb-card__name">{herb.name}</p>
                    <p className="report-herb-card__meta font-data">
                      {showCanonical ? (
                        <>
                          <span className="text-dark-stone">{herb.canonical}</span>
                          <span className="text-dark-stone/50" aria-hidden="true">
                            {' · '}
                          </span>
                        </>
                      ) : null}
                      <span className="report-herb-card__confidence">{herb.confidence}</span>
                    </p>
                  </div>
                </div>
                {herb.preview && (
                  <p className="report-herb-card__preview font-data text-xs leading-relaxed text-dark-stone">
                    {herb.preview}
                  </p>
                )}
              </article>
            );
            })}
          </div>
        </div>

        {!report.formulation && formulationMeta.rejectReason && (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Classical formulation match
            </h3>
            <div className="report-formulation-warning mt-3">
              <p className="text-sm text-inkwell">
                Model suggested{' '}
                <strong>{formulationMeta.rejectedName}</strong>, but it was
                hidden because it does not align with your symptoms.
              </p>
              <p className="mt-2 text-sm text-dark-stone">
                {formulationMeta.rejectReason}
              </p>
              {formulationMeta.datasetAlternative ? (
                <p className="mt-2 text-sm text-inkwell">
                  Dataset-aligned alternative:{' '}
                  <strong>{formulationMeta.datasetAlternative}</strong>
                </p>
              ) : null}
            </div>
          </div>
        )}

        {report.formulation && (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Classical formulation match
            </h3>
            <p className="mt-1 text-sm text-dark-stone">
              Citation shown first. Verify against the source text before clinical use
            </p>
            <article className="report-formulation-card mt-4">
              <p className="report-formulation-card__cite text-label text-ember-orange">
                {report.formulation.reference || 'Classical reference unavailable'}
              </p>
              <p className="report-formulation-card__name font-display mt-2 text-2xl font-light text-inkwell">
                {report.formulation.name}
              </p>
              <p className="mt-1 text-sm text-dark-stone">
                {report.formulation.category}
              </p>
              <dl className="report-formulation-card__grid mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-label text-dark-stone">Classical dosage text</dt>
                  <dd className="mt-1 text-sm text-inkwell">{report.formulation.dosage}</dd>
                </div>
                <div>
                  <dt className="text-label text-dark-stone">Anupana</dt>
                  <dd className="mt-1 text-sm text-inkwell">{report.formulation.anupana}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-label text-dark-stone">Indications</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-dark-stone">
                    {report.formulation.indications}
                  </dd>
                </div>
              </dl>
            </article>
          </div>
        )}

        {report.interactions.length > 0 ? (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Herb-herb interactions
            </h3>
            <p className="mt-1 text-sm text-dark-stone">
              Classical pairs and model screening: Synergistic, Caution, or Contraindicated
            </p>
            <div className="report-interactions-list">
              {report.interactions.map((inter, i) => {
                const tone = interactionTone(inter.tag);

                return (
                  <article
                    key={`${inter.title}-${i}`}
                    className={`report-interaction report-interaction--${tone}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <p className="text-sm font-medium text-inkwell">{inter.title}</p>
                      {isMeaningfulLabel(inter.type) ? (
                        <span
                          className={`report-interaction__badge report-interaction__badge--${tone}`}
                        >
                          {inter.type}
                        </span>
                      ) : null}
                    </div>
                    {inter.confidence && (
                      <p className="report-interaction__meta font-data">
                        {inter.confidence}
                      </p>
                    )}
                    <ul className="report-bullet-list report-bullet-list--muted report-interaction__points">
                      {inter.source ? <li>Source: {inter.source}</li> : null}
                      {inter.reference ? <li>Reference: {inter.reference}</li> : null}
                      {inter.reason && inter.reason !== '—' ? (
                        <li>Reason: {inter.reason}</li>
                      ) : null}
                      {inter.bodyEffect && inter.bodyEffect !== '—' ? (
                        <li>Body effect: {inter.bodyEffect}</li>
                      ) : null}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Herb-herb interactions
            </h3>
            <p className="mt-2 text-sm text-dark-stone">
              No documented interactions were returned for this herb combination.
            </p>
          </div>
        )}

        <TreatmentGuidance report={report} />

        <div className="report-section">
          <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
            Dosha-rated natural foods
          </h3>
          <p className="mt-1 text-sm text-dark-stone">
            Foods matched to your predicted dosha imbalance only: Vata, Pitta, and Kapha
            (Kaffa) ratings.
          </p>

          <dl className="report-patient-meta mt-4 grid gap-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-dark-stone">Aligned dosha(s)</dt>
              <dd className="text-inkwell">
                {alignedDoshas.map(formatDoshaLabel).join(', ') || '—'}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-dark-stone">Person</dt>
              <dd className="text-inkwell">
                {[
                  report.age != null ? `Age ${report.age}` : null,
                  report.gender ? report.gender : null,
                  report.season ? `Season: ${report.season}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </dd>
            </div>
          </dl>

          <div className="report-foods-grid">
            {foodRecommendations.map((rec) => {
              const foods = filterDisplayFoods(rec.foods);
              if (foods.length === 0) return null;

              return (
                <article key={rec.dosha} className="report-food-card">
                  <div className="report-food-card__head">
                    <p className="report-food-card__name">{formatDoshaLabel(rec.dosha)}</p>
                    <span className="report-food-card__badge">Dosha-rated</span>
                  </div>
                  <ul className="report-food-card__list report-food-card__list--grid">
                    {foods.map((f, i) => (
                      <li key={`${rec.dosha}-${i}`} className="report-food-card__item">
                        {typeof f === 'string' ? (
                          <p>{f}</p>
                        ) : (
                          <>
                            <p className="report-food-card__item-label">{f.label}</p>
                            {f.benefit && (
                              <p className="report-food-card__item-benefit">{f.benefit}</p>
                            )}
                            {f.source && !isKoshaAliasFood(f) ? (
                              <p className="report-food-card__item-source">{f.source}</p>
                            ) : null}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        <DietPlan report={report} />

        <div className="report-panel__disclaimer">
          <MedicalDisclaimer />
        </div>
      </div>
    </section>
  );
}
