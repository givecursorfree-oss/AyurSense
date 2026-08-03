import { useCountUp } from '@/hooks/useCountUp';

/**
 * Inspired by Framer Counter Stats Card - adapted to AyurGenix / Ankar design tokens.
 */
export function CounterStatCard({
  value,
  prefix = '',
  suffix = '',
  label,
  description,
  decimals = 2,
  duration,
  accent = 'violet',
  className = '',
}) {
  const { ref, valueRef, formatted } = useCountUp(value, { duration, decimals });

  const accentClass =
    accent === 'ember' ? 'stat-card--ember' : 'stat-card--violet';

  return (
    <article
      ref={ref}
      className={`stat-card ${accentClass} ${className}`.trim()}
    >
      <div className="stat-card__glow" aria-hidden="true" />
      <div className="stat-card__corner stat-card__corner--bl" aria-hidden="true" />
      <div className="stat-card__corner stat-card__corner--tr" aria-hidden="true" />

      <div className="stat-card__body">
        <p className="stat-card__number font-display">
          {prefix}
          <span ref={valueRef} className="stat-card__value">
            {formatted ?? (decimals > 0 ? (0).toFixed(decimals) : '0')}
          </span>
          {suffix}
        </p>
        <p className="stat-card__label">{label}</p>
        {description && (
          <p className="stat-card__description">{description}</p>
        )}
      </div>
    </article>
  );
}
