import { Link, useLocation } from 'react-router-dom';
import { BrandName } from '@/components/BrandName';
import { MobileNav } from '@/components/MobileNav';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import {
  PRIMARY_NAV,
  isPrimaryNavActive,
  primaryNavHref,
} from '@/data/site-nav';

function navLinkClass(active) {
  return active ? 'app-nav__link app-nav__link--active' : 'app-nav__link';
}

export function AppHeader({ showReportLink = false, activeSection = '' }) {
  const { pathname } = useLocation();
  const onIntake = pathname === '/intake';

  return (
    <header className="app-nav sticky top-0 z-50 border-b border-light-steel/80 bg-canvas/90 backdrop-blur-md">
      <div className="page-container app-nav__inner">
        <Link to="/" className="app-nav__brand">
          <BrandName size="sm" />
        </Link>

        <nav className="app-nav__desktop" aria-label="Primary">
          <ul className="app-nav__list">
            {PRIMARY_NAV.map((item) => {
              const active = isPrimaryNavActive(item, {
                pathname,
                activeSection,
              });
              return (
                <li key={item.hash ?? item.to}>
                  <Link
                    to={primaryNavHref(item)}
                    className={navLinkClass(active)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {showReportLink && (
              <li>
                <a href="#report" className="app-nav__link">
                  Report
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="app-nav__actions">
          <PrimaryCtaLink
            variant="simple"
            className="app-nav__cta hidden shrink-0 md:inline-flex"
          >
            {onIntake ? 'Continue analysis' : 'Start clinical analysis'}
          </PrimaryCtaLink>
          <MobileNav activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}
