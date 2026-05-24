import { useState } from 'react';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { copyReportMarkdown, printReport } from '@/lib/report-export';
import { isMeaningfulLabel } from '@/lib/parse-clinical-report';
import { MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';

const METRICS = [
  { key: 'dosha', label: 'Dosha imbalance' },
  { key: 'severity', label: 'Disease severity' },
  { key: 'dosage', label: 'Safe dosage (model)' },
  { key: 'toxicity', label: 'Toxicity level' },
  { key: 'sideEffects', label: 'Side effects' },
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
              Intelligence <span className="text-dark-stone">report</span>
            </h2>
            <p className="mt-2 text-body-copy text-dark-stone">
              {PRODUCT_NAME} · {MODEL_NAME} — multi-task inference, classical
              formulation alignment, herb–herb interaction screening
            </p>
            <div className="report-export-actions mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary btn-secondary--sm" onClick={handleCopy}>
                {copyState === 'done' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy markdown'}
              </button>
              <button type="button" className="btn-secondary btn-secondary--sm" onClick={printReport}>
                Print / PDF
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

        <div className="report-bento">
          {METRICS.map(({ key, label }) => (
            <MetricTile key={key} label={label} value={report[key]} />
          ))}
          <SafetyTile safety={report.safety} needsReview={needsReview} />
        </div>

        <div className="report-section">
          <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
            Recommended botanical profile
          </h3>
          <p className="mt-1 text-sm text-dark-stone">
            {report.herbs.length} herbs identified from symptom context
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

        {report.formulation && (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Classical formulation match
            </h3>
            <p className="mt-1 text-sm text-dark-stone">
              Aligned from classical texts by symptom and herb overlap
            </p>
            <article className="report-formulation-card mt-4">
              <p className="report-formulation-card__name font-display text-2xl font-light text-inkwell">
                {report.formulation.name}
              </p>
              <p className="mt-1 text-sm text-ember-orange">
                {report.formulation.category}
              </p>
              <dl className="report-formulation-card__grid mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-label text-dark-stone">Dosage</dt>
                  <dd className="mt-1 text-sm text-inkwell">{report.formulation.dosage}</dd>
                </div>
                <div>
                  <dt className="text-label text-dark-stone">Anupana</dt>
                  <dd className="mt-1 text-sm text-inkwell">{report.formulation.anupana}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-label text-dark-stone">Reference</dt>
                  <dd className="mt-1 text-sm text-inkwell">{report.formulation.reference}</dd>
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
              Pharmacological interactions
            </h3>
            <p className="mt-1 text-sm text-dark-stone">
              Classical and model-guided compatibility with confidence scores
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
                    <dl className="report-interaction__details">
                      {inter.source ? (
                        <div>
                          <dt>Source</dt>
                          <dd>{inter.source}</dd>
                        </div>
                      ) : null}
                      {inter.reference && (
                        <div>
                          <dt>Reference</dt>
                          <dd>{inter.reference}</dd>
                        </div>
                      )}
                      <div>
                        <dt>Reason</dt>
                        <dd>{inter.reason}</dd>
                      </div>
                      <div>
                        <dt>Body effect</dt>
                        <dd>{inter.bodyEffect}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="report-section">
            <h3 className="font-display text-xl font-light tracking-tight text-inkwell">
              Pharmacological interactions
            </h3>
            <p className="mt-2 text-sm text-dark-stone">
              No documented interactions were returned for this herb combination.
            </p>
          </div>
        )}

        <div className="report-panel__disclaimer">
          <MedicalDisclaimer />
        </div>
      </div>
    </section>
  );
}
