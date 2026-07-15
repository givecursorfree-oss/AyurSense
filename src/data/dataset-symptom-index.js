/**
 * Symptom → disease row lookup from AyurGenixAI_Dataset_V2_Balanced.csv.
 * Regenerate: npm run dataset:symptoms
 */

import symptomIndex from '@/data/dataset-v2-symptom-index.json';

const STOP = new Set([
  'the', 'and', 'with', 'from', 'that', 'this', 'have', 'has', 'had',
  'are', 'was', 'were', 'for', 'not', 'but', 'can', 'may', 'your',
  'while', 'when', 'during', 'after', 'before', 'into', 'over', 'under',
  'feeling', 'sensation', 'between', 'both', 'also', 'very', 'some',
]);

/** @type {Record<string, string[]>} */
const STEM_EXPANSIONS = {
  burning: ['burn', 'heat', 'acid', 'reflux'],
  eating: ['eat', 'food', 'meal', 'digest'],
  lung: ['chest', 'respiratory', 'breath', 'thorac'],
  lungs: ['chest', 'respiratory', 'breath'],
  nausea: ['vomit', 'sick'],
  bloating: ['bloat', 'gas'],
  cough: ['wheez', 'breath'],
  fever: ['temperature', 'chill'],
  pain: ['ache', 'hurt', 'sore'],
};

function tokenize(text) {
  return [
    ...new Set(
      String(text ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w)),
    ),
  ];
}

function expandTokens(tokens) {
  const out = new Set(tokens);
  for (const t of tokens) {
    out.add(t);
    const stems = STEM_EXPANSIONS[t];
    if (stems) stems.forEach((s) => out.add(s));
  }
  return [...out];
}

/**
 * @param {string} query
 * @param {number} [limit]
 */
export function matchSymptomsToDataset(query, limit = 3) {
  const rawTokens = tokenize(query);
  const queryTokens = expandTokens(rawTokens);
  if (!queryTokens.length) return [];

  const scored = [];

  for (const row of symptomIndex) {
    const rowTokenSet = new Set(row.symptomsTokens);
    let score = 0;
    let hits = 0;

    for (const t of queryTokens) {
      if (rowTokenSet.has(t)) {
        score += 4;
        hits += 1;
        continue;
      }
      for (const rt of rowTokenSet) {
        if (rt.startsWith(t) || t.startsWith(rt)) {
          score += 2;
          hits += 1;
          break;
        }
      }
    }

    const diseaseLower = row.disease.toLowerCase();
    for (const t of queryTokens) {
      if (diseaseLower.includes(t)) score += 2;
    }

    if (score > 0) {
      const matchPercent = Math.min(
        100,
        Math.round((hits / Math.max(queryTokens.length, 1)) * 100),
      );
      scored.push({ ...row, score, matchPercent, matchedTokens: hits });
    }
  }

  scored.sort((a, b) => b.score - a.score || b.matchPercent - a.matchPercent);

  const seen = new Set();
  const unique = [];
  for (const item of scored) {
    const key = item.disease.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}
