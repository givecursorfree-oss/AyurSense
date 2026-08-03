import { Link } from 'react-router-dom';
import { CTA_PRIMARY } from '@/data/brand-copy';

const CORNER_PATH =
  'M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z';

function CornerSvg() {
  return (
    <svg
      className="drawer-cta__corner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 1 32 32"
      aria-hidden="true"
    >
      <path d={CORNER_PATH} />
    </svg>
  );
}

/**
 * Lime drawer-corner CTA (ported from styled-components reference).
 */
export function DrawerCornerCta({
  to,
  href,
  children = CTA_PRIMARY,
  drawerTop = 'Clinical analysis',
  drawerBottom = '...one intake',
  className = '',
  ...rest
}) {
  const isExternal = Boolean(href);
  const CtaTag = isExternal ? 'a' : Link;
  const ctaProps = isExternal ? { href } : { to: to ?? '/intake' };

  return (
    <div className={['drawer-cta', className].filter(Boolean).join(' ')}>
      <div className="drawer-cta__drawer drawer-cta__drawer--top">{drawerTop}</div>
      <div className="drawer-cta__drawer drawer-cta__drawer--bottom">{drawerBottom}</div>
      <CtaTag {...ctaProps} className="drawer-cta__btn" {...rest}>
        <span className="drawer-cta__text">{children}</span>
      </CtaTag>
      <CornerSvg />
      <CornerSvg />
      <CornerSvg />
      <CornerSvg />
    </div>
  );
}
