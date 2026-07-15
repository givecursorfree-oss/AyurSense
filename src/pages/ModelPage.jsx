import { Link } from 'react-router-dom';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { ModelProofStrip } from '@/components/ModelProofStrip';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  CLASSICAL_TEXTS,
  MODEL_NAME,
  MODEL_PROOF,
  PIPELINE_STEPS,
  PRODUCT_NAME,
} from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

export function ModelPage() {
  usePageMeta({
    title: 'AyurGenix V9.2 model overview',
    description:
      'AyurGenix V9.2: IndicBERTv2 + LoRA neural heads merged with 176 cited formulations, 704 herb monographs, and herb-herb safety screening.',
    path: '/model',
  });

  return (
    <div className="page-layout font-ui">
      <main id="main-content" className="site-main" tabIndex={-1}>
        <div className="page-container content-page">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Model overview' },
            ]}
          />

          <header className="content-page__header">
            <p className="text-label mb-3">{PRODUCT_NAME}</p>
            <h1 className="type-page-title">{MODEL_NAME}</h1>
            <p className="section-lede">
              A neuro-symbolic Ayurvedic clinical decision-support model: neural
              multi-task inference plus a classical knowledge kosha in one
              production checkpoint.
            </p>
          </header>

          <section className="content-page__section" aria-labelledby="model-compose-heading">
            <h2 id="model-compose-heading" className="content-stack__title">
              What V9.2 contains
            </h2>
            <ul className="content-stack mt-6">
              <li className="content-stack__item">
                <h3 className="font-display text-lg font-light text-inkwell tracking-tight">
                  Neural layer (from V9.1)
                </h3>
                <p className="mt-2 text-body-sm">
                  IndicBERTv2 + LoRA with seven heads: herbs (27), dosha (9),
                  severity (5), drug-herb conflict, toxicity (3), side-effects
                  (8), and dosage regression.
                </p>
              </li>
              <li className="content-stack__item">
                <h3 className="font-display text-lg font-light text-inkwell tracking-tight">
                  Knowledge kosha (from V9)
                </h3>
                <p className="mt-2 text-body-sm">
                  {MODEL_PROOF[0].value} classical formulations with citations,{' '}
                  {MODEL_PROOF[1].value} herb monographs, classical interaction
                  pairs, and a Random Forest herb-herb fallback.
                </p>
              </li>
            </ul>
          </section>

          <section className="content-page__section" aria-labelledby="model-pipeline-heading">
            <h2 id="model-pipeline-heading" className="content-stack__title">
              Inference path
            </h2>
            <ol className="pipeline-overview__list mt-6">
              {PIPELINE_STEPS.map((item) => (
                <li key={item.step} className="pipeline-overview__item">
                  <span className="pipeline-overview__step font-data">
                    {item.step}
                  </span>
                  <h3 className="pipeline-overview__title">{item.title}</h3>
                  <p className="pipeline-overview__body text-body-sm">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-page__section" aria-labelledby="model-texts-heading">
            <h2 id="model-texts-heading" className="content-stack__title">
              Primary classical texts
            </h2>
            <ul className="knowledge-section__texts mt-6">
              {CLASSICAL_TEXTS.map((name) => (
                <li key={name} className="knowledge-section__chip">
                  {name}
                </li>
              ))}
            </ul>
          </section>

          <div className="content-page__actions">
            <PrimaryCtaLink variant="simple" />
            <Link to="/limitations" className="btn-secondary">
              Limitations and ethics
              <IconChevronRight size={16} className="btn-icon" aria-hidden />
            </Link>
          </div>
        </div>

        <ModelProofStrip />
        <SiteFooter />
      </main>
    </div>
  );
}
