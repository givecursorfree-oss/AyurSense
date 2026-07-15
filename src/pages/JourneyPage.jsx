import { Link } from 'react-router-dom';
import { ClinicalJourney } from '@/components/ClinicalJourney';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PipelineOverview } from '@/components/PipelineOverview';
import { IconChevronRight } from '@/components/icons';
import { usePageMeta } from '@/hooks/usePageMeta';
import { MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';

export function JourneyPage() {
  usePageMeta({
    title: 'Clinical journey',
    description: `Follow the ${PRODUCT_NAME} clinical path powered by ${MODEL_NAME}: intake, neural inference, classical formulation match, and safety screening.`,
    path: '/journey',
  });

  return (
    <div className="page-layout font-ui">
      <main id="main-content" className="site-main" tabIndex={-1}>
        <div className="page-container content-page content-page--compact">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Clinical journey' },
            ]}
          />
          <header className="content-page__header">
            <h1 className="type-page-title">Clinical journey</h1>
            <p className="section-lede">
              Trace how {PRODUCT_NAME} turns a structured intake into a
              reviewable report with {MODEL_NAME}.
            </p>
          </header>
          <Link
            to="/intake"
            className="inline-flex min-h-11 items-center gap-1 text-sm text-dark-stone transition-colors hover:text-inkwell"
          >
            Skip to patient intake
            <IconChevronRight size={16} aria-hidden />
          </Link>
        </div>
        <PipelineOverview />
        <ClinicalJourney />
        <SiteFooter />
      </main>
    </div>
  );
}
