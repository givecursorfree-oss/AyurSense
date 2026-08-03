import { Link } from 'react-router-dom';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  LIMITATIONS_SHORT,
  MEDICAL_DISCLAIMER,
  SCOPE_CAVEAT,
  PRODUCT_NAME,
} from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

const EXTENDED_LIMITS = [
  ...LIMITATIONS_SHORT,
  {
    title: 'Herb-herb coverage is partial',
    body: 'Interaction screening covers curated pairs and common combinations, not every possible herb pairing.',
  },
  {
    title: 'Classical citations are curated',
    body: 'References shown with matched formulas are curated for decision support and are not a manuscript-critical edition.',
  },
];

export function LimitationsPage() {
  usePageMeta({
    title: 'Limitations and ethics',
    description: `${PRODUCT_NAME} limitations: educational CDS only, assistive formulation match, and limited medication keyword screening.`,
    path: '/limitations',
  });

  return (
    <div className="page-layout font-ui">
      <main id="main-content" className="site-main" tabIndex={-1}>
        <div className="page-container content-page">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Limitations and ethics' },
            ]}
          />

          <header className="content-page__header">
            <h1 className="type-page-title">Limitations and ethics</h1>
            <p className="section-lede">
              Use {PRODUCT_NAME} as decision support under practitioner review -
              never as autonomous diagnosis or treatment.
            </p>
          </header>

          <aside className="content-callout" role="note">
            <p className="text-body-sm text-inkwell">{SCOPE_CAVEAT}</p>
          </aside>

          <ul className="content-stack">
            {EXTENDED_LIMITS.map((item) => (
              <li key={item.title} className="content-stack__item">
                <h2 className="content-stack__title">{item.title}</h2>
                <p className="text-body-sm mt-2">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <MedicalDisclaimer />
            <p className="sr-only">{MEDICAL_DISCLAIMER}</p>
          </div>

          <div className="content-page__actions">
            <PrimaryCtaLink variant="simple" />
            <Link to="/model" className="btn-secondary">
              Model overview
              <IconChevronRight size={16} className="btn-icon" aria-hidden />
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
