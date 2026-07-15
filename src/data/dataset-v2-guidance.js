/**
 * Treatment guidance from AyurGenixAI_Dataset_V2_Balanced.csv
 * (Diet and Lifestyle, Yoga & Physical Therapy, Patient Recommendations).
 * Regenerate JSON: npm run dataset:guidance
 */

import guidanceByDosha from '@/data/dataset-v2-dosha-guidance.json';
import { matchSymptomsToDataset } from '@/data/dataset-symptom-index';

const DOSHA_ORDER = ['Vata', 'Pitta', 'Kapha'];

function sortDoshas(doshas) {
  return [...doshas].sort(
    (a, b) => DOSHA_ORDER.indexOf(a) - DOSHA_ORDER.indexOf(b),
  );
}

function lookupKey(doshas) {
  return sortDoshas(doshas).join('-');
}

function mergeUnique(arrays, limit = 6) {
  const seen = new Set();
  const out = [];
  for (const arr of arrays) {
    for (const item of arr ?? []) {
      const key = String(item).trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(String(item).trim());
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
  }
  return out;
}

function collectFromKeys(keys) {
  const diet = [];
  const yoga = [];
  const patient = [];
  const habits = [];

  keys.forEach((key) => {
    const row = guidanceByDosha[key];
    if (!row) return;
    diet.push(...(row.dietLifestyle ?? []));
    yoga.push(...(row.yogaTherapy ?? []));
    patient.push(...(row.patientRecommendations ?? []));
    habits.push(...(row.dietaryHabits ?? []));
  });

  return {
    dietLifestyle: mergeUnique([diet], 8),
    yogaTherapy: mergeUnique([yoga], 6),
    patientRecommendations: mergeUnique([patient], 6),
    dietaryHabits: mergeUnique([habits], 4),
  };
}

/**
 * @param {object} args
 * @param {Array<'Vata'|'Pitta'|'Kapha'>} args.doshas
 */
export function getDatasetTreatmentGuidance({ doshas }) {
  const aligned = sortDoshas(doshas.filter(Boolean));
  if (!aligned.length) {
    return {
      matchedKey: null,
      dietLifestyle: [],
      yogaTherapy: [],
      patientRecommendations: [],
      dietaryHabits: [],
    };
  }

  const primaryKey = lookupKey(aligned);
  const keysToUse = guidanceByDosha[primaryKey]
    ? [primaryKey]
    : aligned.filter((d) => guidanceByDosha[d]);

  const merged = collectFromKeys(
    keysToUse.length ? keysToUse : aligned,
  );

  return {
    matchedKey: keysToUse[0] ?? primaryKey,
    ...merged,
  };
}

/**
 * Prefer symptom-matched dataset row; fall back to dosha aggregate.
 * @param {object} args
 * @param {string} [args.symptoms]
 * @param {Array<'Vata'|'Pitta'|'Kapha'>} args.doshas
 * @param {object} [args.primaryMatch] - from report.enrichment.primaryMatch
 */
export function getSymptomAwareTreatmentGuidance({ symptoms, doshas, primaryMatch }) {
  if (primaryMatch?.score >= 8) {
    const diet = primaryMatch.dietLifestyle ? [primaryMatch.dietLifestyle] : [];
    const patient = primaryMatch.patientRecommendations
      ? [primaryMatch.patientRecommendations]
      : [];
    const habits = primaryMatch.dietaryHabits ? [primaryMatch.dietaryHabits] : [];
    const prevention = primaryMatch.prevention ? [primaryMatch.prevention] : [];

    return {
      matchedKey: `symptom:${primaryMatch.disease}`,
      fromSymptomMatch: true,
      matchedDisease: primaryMatch.disease,
      dietLifestyle: mergeUnique([diet, prevention], 6),
      yogaTherapy: [],
      patientRecommendations: mergeUnique([patient], 5),
      dietaryHabits: mergeUnique([habits], 4),
    };
  }

  if (symptoms?.trim()) {
    const match = matchSymptomsToDataset(symptoms, 1)[0];
    if (match?.score >= 8) {
      return getSymptomAwareTreatmentGuidance({
        doshas,
        primaryMatch: match,
      });
    }
  }

  const doshaGuidance = getDatasetTreatmentGuidance({ doshas });
  return {
    ...doshaGuidance,
    fromSymptomMatch: false,
    matchedDisease: null,
  };
}

/**
 * Short actionable lines for 7-day plan do's (from dataset diet + habits).
 * @param {ReturnType<typeof getDatasetTreatmentGuidance>} guidance
 */
export function datasetLinesForDietPlan(guidance) {
  const lines = [
    ...(guidance.dietaryHabits ?? []),
    ...(guidance.dietLifestyle ?? []),
  ];
  return mergeUnique([lines], 5).map((line) => {
    const trimmed = line.length > 120 ? `${line.slice(0, 117)}…` : line;
    return trimmed;
  });
}
