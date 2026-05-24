import { Link } from 'react-router-dom';
import { BrandName } from '@/components/BrandName';
import {
  FOOTER_PRODUCT_HOME,
  FOOTER_PRODUCT_INTAKE,
} from '@/data/site-nav';

const RESOURCE_LINKS = [
  {
    label: 'AyurGenix V9 API (HF)',
    href: 'https://huggingface.co/spaces/hnninioi/AyurGenixV9-API',
    external: true,
  },
  { label: 'Clinical report', to: '/intake#report' },
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
            Multi-task Ayurvedic clinical intelligence powered by AyurGenix V9
            (IndicBERTv2 + LoRA) — dosha, herbs, safety, and dosage in one inference
            pass.
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
                <li key={link.href ?? link.to}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="site-footer__bar-inner page-container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="site-footer__copy text-xs text-dark-stone">
            © {year} AyurSense · AyurGenix V9. Research and educational clinical
            decision support — not a substitute for licensed medical care.
          </p>
        </div>
      </div>
    </footer>
  );
}
