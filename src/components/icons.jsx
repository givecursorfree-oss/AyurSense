/** Professional inline SVG icons (no external icon library) */

const defaults = ({
  size = 20,
  className = '',
  strokeWidth = 1.75,
}) => ({
  width: size,
  height: size,
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export function IconPulse({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 12h2l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function IconLeaf({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 18 2c1 2 2 4.5 2 8a6 6 0 0 1-9 10z" />
      <path d="M11 20v-8" />
    </svg>
  );
}

export function IconCalendar({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function IconUser({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconHash({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M10 3 8 9M16 3l-2 6M4 13h16M6 21l2-6M14 21l2-6" />
    </svg>
  );
}

export function IconAlert({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

export function IconChevronDown({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconChevronUp({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function IconCheck({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconChevronRight({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconSpinner({ size, className }) {
  const p = defaults({ size, className, strokeWidth: 2 });
  return (
    <svg viewBox="0 0 24 24" {...p} className={`${p.className} animate-spin`}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export function IconSpark({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 14l5.5-1.5L12 3z" />
    </svg>
  );
}

export function IconDocument({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

export function IconBeaker({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />
    </svg>
  );
}

export function IconPill({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function IconHeart({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function IconShieldCheck({ size, className, strokeWidth }) {
  const p = defaults({ size, className, strokeWidth });
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
