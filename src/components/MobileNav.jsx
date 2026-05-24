import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import {
  PRIMARY_NAV,
  isPrimaryNavActive,
  primaryNavHref,
} from '@/data/site-nav';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileNav({ activeSection = '' }) {
  const [open, setOpen] = useState(false);
  const [menuMessage, setMenuMessage] = useState('');
  const { pathname } = useLocation();
  const onIntake = pathname === '/intake';
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const previousFocusRef = useRef(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setMenuMessage('Navigation menu closed');
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    setMenuMessage('Navigation menu opened');
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = panel
      ? [...panel.querySelectorAll(FOCUSABLE)].filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
        )
      : [];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    window.requestAnimationFrame(() => first?.focus());

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !panel || focusables.length === 0) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      const restore = previousFocusRef.current;
      if (restore && typeof restore.focus === 'function') {
        restore.focus();
      } else {
        toggleRef.current?.focus();
      }
    };
  }, [open, closeMenu]);

  return (
    <div className="mobile-nav md:hidden">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {menuMessage}
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-haspopup="dialog"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mobile-nav__toggle-label" aria-hidden="true">
          {open ? 'Close' : 'Menu'}
        </span>
        <span className="mobile-nav__bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <button
          type="button"
          className="mobile-nav__backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
      )}

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={`mobile-nav__panel ${open ? 'mobile-nav__panel--open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="mobile-nav__links">
            {PRIMARY_NAV.map((item) => {
              const active = isPrimaryNavActive(item, {
                pathname,
                activeSection,
              });
              return (
                <li key={item.hash ?? item.to}>
                  <Link
                    to={primaryNavHref(item)}
                    className={active ? 'mobile-nav__link--active' : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {!onIntake && (
              <li>
                <Link
                  to="/intake"
                  className={pathname === '/intake' ? 'mobile-nav__link--active' : undefined}
                  onClick={closeMenu}
                >
                  Patient intake
                </Link>
              </li>
            )}
            {onIntake && (
              <li>
                <a
                  href="#report"
                  className="mobile-nav__link--report"
                  onClick={closeMenu}
                >
                  View report
                </a>
              </li>
            )}
          </ul>
          <PrimaryCtaLink
            variant="simple"
            className="mobile-nav__panel-cta"
            showIcon
            onClick={closeMenu}
          >
            {onIntake ? 'Continue analysis' : 'Start clinical analysis'}
          </PrimaryCtaLink>
        </nav>
      </div>
    </div>
  );
}
