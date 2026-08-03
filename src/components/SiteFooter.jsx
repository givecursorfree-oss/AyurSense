import { Link } from 'react-router-dom';
import { BrandName } from '@/components/BrandName';
import {
  FOOTER_PRODUCT_HOME,
  FOOTER_PRODUCT_INTAKE,
  FOOTER_TRUST,
} from '@/data/site-nav';
import { MEDICAL_DISCLAIMER, PRODUCT_NAME } from '@/data/brand-copy';

const RESOURCE_LINKS = [
  { label: 'Clinical report', to: '/intake#report' },
  { label: 'Limitations & ethics', to: '/limitations' },
];

export function SiteFooter({ intakePage = false }) {
  const productLinks = intakePage ? FOOTER_PRODUCT_INTAKE : FOOTER_PRODUCT_HOME;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__main page-container">
        <div className="site-footer__brand-block">
          <Link to="/" className="site-footer__logo">
            <BrandName size="xl" inverse className="site-footer__brand-name" />
          </Link>
          <p className="site-footer__tagline">
            {PRODUCT_NAME}. Ayurvedic clinical decision support with
            citation-backed suggestions and safety flags for practitioner review.
          </p>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__col">
            <p className="site-footer__label text-label">Product</p>
            <ul className="site-footer__links">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__label text-label">Resources</p>
            <ul className="site-footer__links">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__label text-label">Trust</p>
            <ul className="site-footer__links">
              {FOOTER_TRUST.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="site-footer__bar-inner page-container flex flex-col gap-3 py-6 md:flex-row md:items-start md:justify-between">
          <p className="site-footer__copy text-xs text-dark-stone max-w-2xl">
            © {year} {PRODUCT_NAME}. {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>
  );
}
