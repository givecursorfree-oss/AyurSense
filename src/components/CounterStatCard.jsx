import { useCountUp } from '@/hooks/useCountUp';

/**
 * Inspired by Framer Counter Stats Card — adapted to AyurGenix / Ankar design tokens.
 */
export function CounterStatCard({
  value,
  prefix = '',
  suffix = '',
  label,
  description,
  decimals = 2,
  duration = 2000,
  accent = 'violet',
  className = '',
}) {
  const { ref, formatted } = useCountUp(value, { duration, decimals });

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
          <span className="stat-card__value">{formatted}</span>
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

export const MODEL_STATS = [
  {
    value: 99.28,
    suffix: '%',
    label: 'Herb accuracy',
    description: 'Multi-task botanical recommendation head',
    decimals: 2,
    accent: 'violet',
  },
  {
    value: 176,
    suffix: '',
    label: 'Classical formulations',
    description: 'Matched from classical Ayurvedic texts',
    decimals: 0,
    accent: 'ember',
  },
  {
    value: 5,
    suffix: '',
    label: 'Clinical tasks',
    description: 'Dosha, severity, safety, herbs, dosage',
    decimals: 0,
    accent: 'violet',
  },
  {
    value: 700,
    suffix: '+',
    label: 'Herb knowledge base',
    description: 'Dravyaguna graph for interaction ML',
    decimals: 0,
    accent: 'ember',
  },
];
