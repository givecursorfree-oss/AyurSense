import {
  formatDoshaLabel,
  foodItemDisplay,
  generateDietPlan,
  normalizeDoshas,
} from '@/data/natural-food-recommendations';

function MealFoodItem({ item }) {
  if (typeof item === 'string') {
    return <li className="diet-plan-food-item">{item}</li>;
  }

  return (
    <li className="diet-plan-food-item">
      <p className="diet-plan-food-item__label">{item.label}</p>
      {item.benefit && (
        <p className="diet-plan-food-item__benefit">{item.benefit}</p>
      )}
    </li>
  );
}

export function DietPlan({ report }) {
  const parsedDoshas = normalizeDoshas(report.dosha);
  const alignedDoshas =
    parsedDoshas.length > 0 ? parsedDoshas : ['Vata', 'Pitta', 'Kapha'];

  const plan = generateDietPlan({
    doshas: alignedDoshas,
    season: report.season,
    symptoms: report.symptoms,
    primaryMatch: report.enrichment?.primaryMatch,
  });

  const meals = [
    { key: 'morning', label: 'Morning' },
    { key: 'midday', label: 'Midday' },
    { key: 'evening', label: 'Evening' },
  ];

  return (
    <section
      id="diet-plan"
      className="diet-plan-panel scroll-mt-24"
      aria-labelledby="diet-plan-heading"
    >
      <div className="diet-plan-panel__glow" aria-hidden="true" />

      <header className="diet-plan-panel__header">
        <p className="diet-plan-panel__badge text-label">Personalized guidance</p>
        <h3
          id="diet-plan-heading"
          className="font-display text-2xl font-light tracking-tight text-inkwell sm:text-3xl"
        >
          <span className="diet-plan-heading__personalized">Personalized</span>{' '}
          <span className="text-dark-stone">diet plan</span>
        </h3>
        <p className="diet-plan-panel__lede mt-3 text-sm leading-relaxed text-dark-stone sm:text-base">
          Practical do&apos;s, don&apos;s, and meal direction aligned to{' '}
          <strong className="font-medium text-inkwell">
            {alignedDoshas.map(formatDoshaLabel).join(', ')}
          </strong>
          {report.season ? ` · Season: ${report.season}` : ''}.
        </p>
      </header>

      <div className="diet-plan-panel__summary">
        <div className="diet-plan-summary-col">
          <h4 className="diet-plan-summary-col__title">Do&apos;s</h4>
          <ul className="report-bullet-list diet-plan-list diet-plan-list--dos">
            {plan.globalDos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="diet-plan-summary-col">
          <h4 className="diet-plan-summary-col__title">Don&apos;ts</h4>
          <ul className="report-bullet-list diet-plan-list diet-plan-list--dont">
            {plan.globalDonts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="diet-plan-meals-overview">
        <h4 className="diet-plan-meals-overview__title text-label">Suggested meals</h4>
        <div className="diet-plan-meals-overview__grid">
          {meals.map(({ key, label }) => (
            <article key={key} className="diet-plan-meal-block">
              <p className="diet-plan-meal-label">{label}</p>
              <ul className="report-bullet-list diet-plan-meal-list">
                {(plan.mealSuggestions[key] ?? []).map((m) => (
                  <MealFoodItem
                    key={`${key}-${foodItemDisplay(m)}`}
                    item={m}
                  />
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
