import { Link } from 'react-router-dom';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { usePageMeta } from '@/hooks/usePageMeta';
import { MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

export function ModelPage() {
  usePageMeta({
    title: 'Model overview',
    description: `${PRODUCT_NAME} clinical decision support powered by ${MODEL_NAME} for practitioner review.`,
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
              Clinical decision support for Ayurveda: structured intake,
              citation-backed suggestions, and safety flags for qualified
              practitioner review.
            </p>
          </header>

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
