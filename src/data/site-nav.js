/** Shared primary navigation — keep desktop, mobile, and footer labels in sync */

export const HOME_SCROLL_SECTIONS = [
  'how-it-works',
  'capabilities',
  'faq',
];

export const PRIMARY_NAV = [
  { label: 'How it works', hash: 'how-it-works' },
  { label: 'Capabilities', hash: 'capabilities' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Model', to: '/model' },
  { label: 'FAQ', hash: 'faq' },
];

export function primaryNavHref(item) {
  if (item.to) return item.to;
  return `/#${item.hash}`;
}

export function isPrimaryNavActive(item, { pathname, activeSection }) {
  if (item.to) return pathname === item.to;
  if (pathname !== '/') return false;
  return activeSection === item.hash;
}

export const FOOTER_PRODUCT_HOME = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Capabilities', to: '/#capabilities' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Patient intake', to: '/intake' },
  { label: 'Model (V9.2)', to: '/model' },
  { label: 'FAQ', to: '/#faq' },
];

export const FOOTER_PRODUCT_INTAKE = [
  { label: 'Home', to: '/' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Patient intake', to: '/intake' },
  { label: 'Limitations', to: '/limitations' },
];

export const FOOTER_TRUST = [
  { label: 'Limitations and ethics', to: '/limitations' },
  { label: 'Model overview', to: '/model' },
];
