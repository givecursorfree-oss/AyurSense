import { MODEL_PROOF } from '@/data/brand-copy';

/** Scannable V9.2 proof strip - below hero content */
export function ModelProofStrip() {
  return (
    <section
      id="performance"
      className="model-proof section-block section-block--surface scroll-mt-24 border-b border-light-steel"
      aria-labelledby="model-proof-heading"
    >
      <div className="page-container">
        <h2 id="model-proof-heading" className="section-heading">
          What ships in the{' '}
          <span className="section-heading__muted">production model</span>
        </h2>
        <p className="section-lede">
          Neural clinical heads plus a classical knowledge kosha in one
          checkpoint for inference, formulation matching, and safety screening.
        </p>

        <ul className="model-proof__grid mt-10">
          {MODEL_PROOF.map((item) => (
            <li key={item.label} className="model-proof__item">
              <p className="model-proof__value font-data">{item.value}</p>
              <p className="model-proof__label">{item.label}</p>
              <p className="model-proof__hint text-body-sm">{item.hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
