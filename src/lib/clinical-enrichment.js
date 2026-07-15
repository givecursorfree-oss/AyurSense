/**
 * Post-model clinical enrichment: symptom→dataset retrieval, confidence gating,
 * formulation validation, red-flag triage, and interaction de-biasing.
 */

import { matchSymptomsToDataset } from '@/data/dataset-symptom-index';

const HERB_MIN_CONFIDENCE = 10;
const STRONG_MATCH_SCORE = 8;
const GENERIC_SYNERGY_REASON =
  /aligned rasa\/virya supports combined therapeutic action/i;

/** @param {string} symptoms */
export function detectRedFlags(symptoms) {
  const text = String(symptoms ?? '');
  const flags = [];

  if (/\b(burning|burn|pressure|tightness|pain).{0,40}(chest|lung|heart|between)\b/i.test(text)) {
    flags.push({
      level: 'urgent',
      title: 'Chest symptoms need medical evaluation',
      message:
        'Burning or pain in the chest area can sometimes reflect cardiac, pulmonary, or reflux conditions. Seek urgent medical care if symptoms are severe, sudden, or accompanied by breathlessness, sweating, or arm pain.',
    });
  }

  if (/\b(severe|sudden|crushing|cannot breathe|fainting|blood)\b/i.test(text)) {
    flags.push({
      level: 'urgent',
      title: 'Urgent symptoms reported',
      message:
        'This intake includes language that may indicate an emergency. Ayurvedic suggestions are educational only — contact emergency services or a physician immediately when appropriate.',
    });
  }

  return flags;
}

/** @param {string} symptoms */
export function symptomDomains(symptoms) {
  const t = String(symptoms ?? '').toLowerCase();
  return {
    gi: /\b(eat|food|digest|stomach|abdom|nausea|bloat|appetite|reflux|acid|indigest)\b/.test(t),
    chest: /\b(chest|lung|thorac|breath|wheez|respir)\b/.test(t),
    burning: /\b(burn|heat|acid)\b/.test(t),
    reproductive:
      /\b(period|menstr|fertil|uterine|pregnan|ovary|infertil|libido)\b/.test(t),
  };
}

/** @param {string} confidence */
export function parseConfidencePercent(confidence) {
  const m = String(confidence ?? '').match(/([\d.]+)\s*%/);
  return m ? parseFloat(m[1]) : 0;
}

/**
 * @param {object} formulation
 * @param {string} symptoms
 */
export function formulationAlignsWithSymptoms(formulation, symptoms) {
  if (!formulation?.name) return { aligned: false, reason: 'No formulation provided' };

  const domains = symptomDomains(symptoms);
  const blob = `${formulation.category} ${formulation.indications} ${formulation.name}`.toLowerCase();

  const isReproductive =
    /reproductive|infertil|uterine|pregnancy|vandhyatva|yoni|amenorrhea|dysmenorrhea/.test(blob);

  if (isReproductive && !domains.reproductive) {
    return {
      aligned: false,
      reason:
        'Formulation category/indications target reproductive health, which does not match the reported symptoms.',
    };
  }

  if (domains.gi || domains.chest || domains.burning) {
    const giAligned =
      /digest|gastro|appetite|indigest|agni|ama|pachana|visuchika|reflux|stomach|nausea|detox|jwara|respiratory|cough|asthma|burn|herb|vati|gutika|churna/.test(
        blob,
      );
    if (!giAligned && isReproductive) {
      return {
        aligned: false,
        reason: 'No digestive, respiratory, or Pitta/GI alignment found for this complaint.',
      };
    }
  }

  return { aligned: true, reason: '' };
}

/**
 * @param {string} modelDosha
 * @param {string} symptoms
 * @param {object | undefined} primaryMatch
 */
function refineDosha(modelDosha, symptoms, primaryMatch) {
  if (primaryMatch && primaryMatch.score >= STRONG_MATCH_SCORE && primaryMatch.doshas) {
    return {
      dosha: primaryMatch.doshas,
      confidence: 'high',
      source: 'dataset',
      note: `Aligned to dataset match: ${primaryMatch.disease}`,
    };
  }

  const domains = symptomDomains(symptoms);
  const model = String(modelDosha ?? '').toLowerCase();

  if (domains.burning && (domains.gi || domains.chest) && model === 'vata') {
    return {
      dosha: 'pitta, vata',
      confidence: 'medium',
      source: 'symptom-rules',
      note: 'Burning with eating/chest context — Pitta–Vata pattern applied.',
    };
  }

  if (domains.burning && !model.includes('pitta')) {
    return {
      dosha: model.includes('vata') ? 'pitta, vata' : 'pitta',
      confidence: 'medium',
      source: 'symptom-rules',
      note: 'Heat/burning symptoms suggest Pitta involvement.',
    };
  }

  return {
    dosha: modelDosha || 'N/A',
    confidence: 'low',
    source: 'model',
    note: 'Model dosha only — verify with a qualified practitioner.',
  };
}

/**
 * @param {string} modelSeverity
 * @param {object | undefined} primaryMatch
 */
function refineSeverity(modelSeverity, primaryMatch) {
  if (primaryMatch?.severity && primaryMatch.score >= STRONG_MATCH_SCORE) {
    return {
      severity: primaryMatch.severity,
      source: 'dataset',
    };
  }
  return { severity: modelSeverity || 'N/A', source: 'model' };
}

/** @param {string} dosage */
export function formatDosageDisplay(dosage) {
  const num = parseFloat(String(dosage ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(num) || num < 50) return dosage || 'N/A';
  const low = Math.round(num * 0.85);
  const high = Math.round(num * 1.15);
  return `${low}–${high} mg/day (model estimate)`;
}

/**
 * @param {{ name: string, confidence: string, canonical: string, preview: string }[]} herbs
 * @param {object | undefined} primaryMatch
 */
function refineHerbs(herbs, primaryMatch) {
  const filtered = (herbs ?? []).filter(
    (h) => parseConfidencePercent(h.confidence) >= HERB_MIN_CONFIDENCE,
  );

  const existing = new Set(
    filtered.map((h) => `${h.name} ${h.canonical}`.toLowerCase()),
  );

  if (primaryMatch?.herbs && primaryMatch.score >= STRONG_MATCH_SCORE) {
    const datasetHerbs = String(primaryMatch.herbs)
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const name of datasetHerbs) {
      const key = name.toLowerCase();
      if ([...existing].some((e) => e.includes(key) || key.includes(e.split(' ')[0]))) {
        continue;
      }
      filtered.push({
        name,
        canonical: name.toLowerCase().replace(/\s+/g, ' '),
        confidence: 'Dataset match',
        preview: `From matched condition: ${primaryMatch.disease}`,
        fromDataset: true,
      });
      existing.add(key);
    }
  }

  return filtered.slice(0, 6);
}

/**
 * @param {object[]} interactions
 */
export function refineInteractions(interactions) {
  const list = interactions ?? [];
  if (!list.length) return list;

  const genericCount = list.filter(
    (i) =>
      /^SYNERGISTIC$/i.test(i.type) &&
      /98\.0%/.test(i.confidence ?? '') &&
      GENERIC_SYNERGY_REASON.test(i.reason ?? ''),
  ).length;

  if (genericCount === list.length) {
    return list.map((i) => ({
      ...i,
      tag: 'OK',
      confidence: 'Generally compatible (rule-based screening)',
      reason:
        i.reason && !GENERIC_SYNERGY_REASON.test(i.reason)
          ? i.reason
          : 'No classical contraindication flagged for this pair. Confirm dosage and constitution with a practitioner.',
      genericTemplate: true,
    }));
  }

  return list.map((i) => {
    if (
      /^SYNERGISTIC$/i.test(i.type) &&
      /98\.0%/.test(i.confidence ?? '') &&
      GENERIC_SYNERGY_REASON.test(i.reason ?? '')
    ) {
      return {
        ...i,
        confidence: 'Compatible (screened)',
        genericTemplate: true,
      };
    }
    return i;
  });
}

/**
 * @param {object} parsed - output of parseClinicalReport
 * @param {object} context
 * @param {string} context.symptomsRaw - user-entered symptoms (without pattern suffix)
 */
export function enrichClinicalReport(parsed, context = {}) {
  const symptomsRaw =
    context.symptomsRaw ??
    String(parsed.symptoms ?? '')
      .split(/\n\nPredominant pattern:/i)[0]
      .trim();

  const matches = matchSymptomsToDataset(symptomsRaw, 3);
  const primaryMatch = matches[0] ?? null;
  const redFlags = detectRedFlags(symptomsRaw);

  const doshaRefined = refineDosha(parsed.dosha, symptomsRaw, primaryMatch);
  const severityRefined = refineSeverity(parsed.severity, primaryMatch);
  const herbs = refineHerbs(parsed.herbs, primaryMatch);

  let formulation = parsed.formulation;
  let formulationMeta = { visible: true, rejectReason: '', datasetAlternative: '' };

  if (formulation) {
    const alignment = formulationAlignsWithSymptoms(formulation, symptomsRaw);
    if (!alignment.aligned) {
      formulationMeta = {
        visible: false,
        rejectReason: alignment.reason,
        rejectedName: formulation.name,
        datasetAlternative: primaryMatch?.formulation || '',
      };
      formulation = null;
    }
  }

  if (!formulation && primaryMatch?.formulation && primaryMatch.score >= STRONG_MATCH_SCORE) {
    formulationMeta.datasetAlternative = primaryMatch.formulation;
  }

  const interactions = refineInteractions(parsed.interactions);
  const dosage = formatDosageDisplay(parsed.dosage);

  return {
    ...parsed,
    symptoms: symptomsRaw,
    dosha: doshaRefined.dosha,
    severity: severityRefined.severity,
    herbs,
    formulation,
    interactions,
    dosage,
    enrichment: {
      redFlags,
      matchedDiseases: matches.map((m) => ({
        disease: m.disease,
        score: m.score,
        matchPercent: m.matchPercent,
        symptoms: m.symptoms,
        doshas: m.doshas,
        severity: m.severity,
      })),
      primaryMatch: primaryMatch
        ? {
            disease: primaryMatch.disease,
            score: primaryMatch.score,
            matchPercent: primaryMatch.matchPercent,
            symptoms: primaryMatch.symptoms,
            doshas: primaryMatch.doshas,
            herbs: primaryMatch.herbs,
            formulation: primaryMatch.formulation,
            dietLifestyle: primaryMatch.dietLifestyle,
            patientRecommendations: primaryMatch.patientRecommendations,
            dietaryHabits: primaryMatch.dietaryHabits,
            prevention: primaryMatch.prevention,
          }
        : null,
      doshaRefined,
      severityRefined,
      formulationMeta,
      herbThresholdPercent: HERB_MIN_CONFIDENCE,
    },
  };
}
