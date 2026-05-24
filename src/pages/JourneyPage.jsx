import { Link } from 'react-router-dom';
import { ClinicalJourney } from '@/components/ClinicalJourney';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IconChevronRight } from '@/components/icons';

export function JourneyPage() {
  return (
    <div className="page-layout font-ui">
      <main id="main-content" className="site-main" tabIndex={-1}>
        <div className="page-container py-8">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Clinical journey' },
            ]}
          />
          <Link
            to="/intake"
            className="mt-4 inline-flex items-center gap-1 text-sm text-dark-stone transition-colors hover:text-inkwell"
          >
            Skip to patient intake
            <IconChevronRight size={16} aria-hidden />
          </Link>
        </div>
        <ClinicalJourney />
        <SiteFooter />
      </main>
    </div>
  );
}
