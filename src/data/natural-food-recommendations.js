/**
 * Dosha-rated natural food guidance (ahara).
 * Curated Vata–Pitta–Kapha lists aligned to model-predicted imbalance.
 */

import {
  datasetLinesForDietPlan,
  getSymptomAwareTreatmentGuidance,
} from '@/data/dataset-v2-guidance';

export const INTERNAL_EXTERNAL_OPTIONS = ['Internal', 'External', 'None'];

const KOSHA_SOURCE_PATTERN =
  /ayurgenix kosha|herb\/ahara alias index|kosha knowledgebundle/i;

/** @type {Record<'Vata'|'Pitta'|'Kapha', { label: string, benefit: string, source: string }[]>} */
export const NATURAL_FOODS_BY_DOSHA = {
  Vata: [
    {
      label: 'Warm cooked grains',
      benefit: 'Rice, wheat porridge, oats — grounding and easy to digest',
      source: 'Dosha ahara — Vata pacifying',
    },
    {
      label: 'Soups and broths',
      benefit: 'Prefer freshly cooked, warm liquids',
      source: 'Dosha ahara — Vata pacifying',
    },
    {
      label: 'Root vegetables',
      benefit: 'Carrot, beet, sweet potato, pumpkin',
      source: 'Dosha ahara — Vata pacifying',
    },
    {
      label: 'Stewed fruits',
      benefit: 'Ripe banana, pomegranate, dates (small portions)',
      source: 'Dosha ahara — Vata pacifying',
    },
    {
      label: 'Healthy fats',
      benefit: 'Ghee, sesame oil, olive oil in moderation',
      source: 'Dosha ahara — Vata pacifying',
    },
    {
      label: 'Warm digestive spices',
      benefit: 'Ginger, cumin, turmeric, cardamom, cinnamon',
      source: 'Dosha ahara — Vata pacifying',
    },
  ],
  Pitta: [
    {
      label: 'Cooling grains',
      benefit: 'Basmati rice, barley, oats porridge',
      source: 'Dosha ahara — Pitta pacifying',
    },
    {
      label: 'Light vegetables',
      benefit: 'Bottle gourd (lauki), spinach, cucumber-supportive meals',
      source: 'Dosha ahara — Pitta pacifying',
    },
    {
      label: 'Coriander and fennel',
      benefit: 'Dhania and saunf as cooling digestive aids',
      source: 'Dosha ahara — Pitta pacifying',
    },
    {
      label: 'Sweet fruits',
      benefit: 'Papaya, pomegranate, ripe banana in moderation',
      source: 'Dosha ahara — Pitta pacifying',
    },
    {
      label: 'Coconut water',
      benefit: 'Hydration support when suitable for you',
      source: 'Dosha ahara — Pitta pacifying',
    },
    {
      label: 'Mild cooling spices',
      benefit: 'Coriander, fennel, cardamom',
      source: 'Dosha ahara — Pitta pacifying',
    },
  ],
  Kapha: [
    {
      label: 'Light grains',
      benefit: 'Barley (yava), jowar, bajra as appropriate',
      source: 'Dosha ahara — Kapha pacifying',
    },
    {
      label: 'Steamed vegetables',
      benefit: 'Broccoli, cauliflower, radish, cabbage',
      source: 'Dosha ahara — Kapha pacifying',
    },
    {
      label: 'Bitter greens',
      benefit: 'In moderation when appropriate',
      source: 'Dosha ahara — Kapha pacifying',
    },
    {
      label: 'Moong dal soups',
      benefit: 'Light, warm preparations',
      source: 'Dosha ahara — Kapha pacifying',
    },
    {
      label: 'Kapha-balancing spices',
      benefit: 'Ginger, turmeric, mild black pepper',
      source: 'Dosha ahara — Kapha pacifying',
    },
    {
      label: 'Lighter fruits',
      benefit: 'Apple, pomegranate in moderation',
      source: 'Dosha ahara — Kapha pacifying',
    },
  ],
};

/** @type {Record<'Vata'|'Pitta'|'Kapha', { dos: string[], donts: string[] }>} */
export const DOSHA_DAILY_GUIDANCE = {
  Vata: {
    dos: [
      'Eat warm, freshly cooked meals at regular times',
      'Favour grounding oils (ghee, sesame) in small amounts',
      'Keep hydration warm — herbal teas over ice-cold drinks',
      'Maintain a calm meal environment; eat slowly',
    ],
    donts: [
      'Avoid excessive raw, cold, or dry snack foods',
      'Limit caffeine and very bitter/astringent fasting',
      'Skip heavy late-night meals that disturb sleep',
      'Reduce erratic meal timing and skipped meals',
    ],
  },
  Pitta: {
    dos: [
      'Prefer cooling, mildly spiced preparations',
      'Eat the main meal at midday when Agni is strongest',
      'Include sweet, bitter, and astringent tastes in balance',
      'Stay hydrated with room-temperature water',
    ],
    donts: [
      'Avoid very spicy, sour, salty, and deep-fried foods',
      'Limit alcohol, vinegar-heavy dressings, and excess chilli',
      'Reduce skipping meals when under stress or heat',
      'Avoid eating when angry or overheated',
    ],
  },
  Kapha: {
    dos: [
      'Favour light, warm, and well-spiced meals',
      'Eat the largest meal at lunch; keep dinner early and light',
      'Include pungent and bitter vegetables in rotation',
      'Stay active after meals with gentle walking',
    ],
    donts: [
      'Avoid heavy dairy, excessive sweets, and fried foods',
      'Limit daytime napping immediately after large meals',
      'Reduce cold, heavy, and mucus-forming combinations',
      'Avoid overeating and late-night snacking',
    ],
  },
};

/** @param {string|{ source?: string }} item */
export function isKoshaAliasFood(item) {
  if (typeof item === 'string') return false;
  return KOSHA_SOURCE_PATTERN.test(String(item.source ?? ''));
}

/** @param {Array<string|{ label: string, benefit?: string, source?: string }>} foods */
export function filterDisplayFoods(foods) {
  return (foods ?? []).filter((f) => !isKoshaAliasFood(f));
}

function mergeFoodsForDosha(dosha) {
  return filterDisplayFoods(NATURAL_FOODS_BY_DOSHA[dosha] ?? []);
}

export function foodItemDisplay(item) {
  if (typeof item === 'string') return item;
  return item.benefit ? `${item.label}: ${item.benefit}` : item.label;
}

export function normalizeDoshas(doshaText) {
  const s = String(doshaText ?? '').toLowerCase();
  /** @type {Array<'Vata'|'Pitta'|'Kapha'>} */
  const out = [];
  if (s.includes('vata')) out.push('Vata');
  if (s.includes('pitta')) out.push('Pitta');
  if (s.includes('kapha') || s.includes('kaffa') || s.includes('kafha'))
    out.push('Kapha');
  return out;
}

export function formatDoshaLabel(dosha) {
  if (dosha === 'Kapha') return 'Kapha (Kaffa)';
  return dosha;
}

/**
 * @param {object} args
 * @param {Array<'Vata'|'Pitta'|'Kapha'>} args.doshas
 */
export function getRecommendedNaturalFoods({ doshas }) {
  return doshas.map((d) => ({
    dosha: d,
    foods: mergeFoodsForDosha(d),
  }));
}

function pickRotating(pool, index, count = 1) {
  if (!pool.length) return [];
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(pool[(index + i) % pool.length]);
  }
  return out;
}

function mergeGuidance(doshas) {
  const dos = new Set();
  const donts = new Set();
  doshas.forEach((d) => {
    const g = DOSHA_DAILY_GUIDANCE[d];
    if (!g) return;
    g.dos.forEach((x) => dos.add(x));
    g.donts.forEach((x) => donts.add(x));
  });
  return {
    dos: [...dos].slice(0, 6),
    donts: [...donts].slice(0, 6),
  };
}

/**
 * Single personalised diet plan (do's, don'ts, meal suggestions).
 * @param {object} args
 * @param {Array<'Vata'|'Pitta'|'Kapha'>} args.doshas
 * @param {string} [args.season]
 */
export function generateDietPlan({ doshas, season, symptoms, primaryMatch }) {
  const foodPool = doshas.flatMap((d) => mergeFoodsForDosha(d));
  const { dos, donts } = mergeGuidance(doshas);
  const datasetGuidance = getSymptomAwareTreatmentGuidance({
    doshas,
    symptoms,
    primaryMatch,
  });
  const datasetDos = datasetLinesForDietPlan(datasetGuidance);
  const globalDos = [...dos, ...datasetDos.filter((d) => !dos.includes(d))].slice(
    0,
    8,
  );

  return {
    doshas,
    season,
    globalDos,
    globalDonts: donts,
    mealSuggestions: {
      morning: pickRotating(foodPool, 0, 2),
      midday: pickRotating(foodPool, 2, 2),
      evening: pickRotating(foodPool, 4, 2),
    },
    recommendedFoods: foodPool,
  };
}

/** @deprecated Use generateDietPlan */
export function generateSevenDayDietPlan(args) {
  return generateDietPlan(args);
}
