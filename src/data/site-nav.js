/** Shared primary navigation — keep desktop, mobile, and footer labels in sync */

export const HOME_SCROLL_SECTIONS = [
  'how-it-works',
  'capabilities',
  'classical-wisdom',
  'performance',
];

export const PRIMARY_NAV = [
  { label: 'Three steps', hash: 'how-it-works' },
  { label: 'Capabilities', hash: 'capabilities' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Classical wisdom', hash: 'classical-wisdom' },
  { label: 'Model metrics', hash: 'performance' },
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
  { label: 'Three steps', to: '/#how-it-works' },
  { label: 'Capabilities', to: '/#capabilities' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Patient intake', to: '/intake' },
  { label: 'Classical wisdom', to: '/#classical-wisdom' },
  { label: 'Model metrics', to: '/#performance' },
];

export const FOOTER_PRODUCT_INTAKE = [
  { label: 'Home', to: '/' },
  { label: 'Three steps', to: '/#how-it-works' },
  { label: 'Capabilities', to: '/#capabilities' },
  { label: 'Clinical journey', to: '/journey' },
  { label: 'Patient intake', to: '/intake' },
];
