import { Link } from 'react-router-dom';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  MODEL_NAME,
  PIPELINE_STEPS,
  PRODUCT_NAME,
} from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

export function ModelPage() {
  usePageMeta({
    title: 'AyurGenix V9.2 model overview',
    description:
      'AyurGenix V9.2: multi-task clinical inference with classical formulation matching and safety screening for practitioner review.',
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
              production workflow.
            </p>
          </header>

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

          <div className="content-page__actions">
            <PrimaryCtaLink variant="simple" />
            <Link to="/limitations" className="btn-secondary">
              Limitations and ethics
              <IconChevronRight size={16} className="btn-icon" aria-hidden />
            </Link>
          </div>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
