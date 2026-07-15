/** Product naming - AyurSense (product) · AyurGenix V9.2 (model/API) */
export const PRODUCT_NAME = 'AyurSense';
export const MODEL_NAME = 'AyurGenix V9.2';
export const MODEL_SHORT = 'V9.2';

export const SITE_URL = 'https://ayursense.vercel.app';

export const DEFAULT_TITLE = 'AyurSense - Ayurvedic Clinical Decision Support';
export const DEFAULT_DESCRIPTION =
  'Clinical decision support for Ayurveda: symptoms to dosha, herbs, cited classical formulations, and safety flags. Powered by AyurGenix V9.2.';

export const MEDICAL_DISCLAIMER =
  'For research and educational clinical decision support only. Not a substitute for diagnosis, treatment, or advice from a licensed physician or qualified Ayurvedic practitioner.';

export const METRICS_CAVEAT =
  'Overall clinical accuracy (99.98%) is from the clinical_97 template-holdout evaluation (in-distribution). Free-text out-of-distribution symptoms may score lower.';

export const HERO_HEADLINE = 'From symptoms to a citation-backed clinical report';
export const HERO_SUPPORT =
  'Structured intake. AyurGenix V9.2 returns dosha, herbs, cited formulations, and safety flags for practitioner review.';

export const CTA_PRIMARY = 'Start patient intake';
export const CTA_SECONDARY = 'See how it works';

/** V9.2 proof counts - from production model report */
export const MODEL_PROOF = [
  { value: '176', label: 'Classical formulations', hint: 'With grantha citations' },
  { value: '704', label: 'Herb monographs', hint: 'Rasa · virya · vipaka' },
  { value: '7', label: 'Neural heads', hint: 'One inference pass' },
  { value: '10', label: 'Classical texts', hint: 'Including Bhaishajya Ratnavali' },
];

export const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Patient intake',
    body: 'Symptoms, season, age, gender, and optional medications.',
  },
  {
    step: '02',
    title: 'Neural inference',
    body: 'Seven heads: herbs, dosha, severity, conflict, toxicity, side-effects, dosage.',
  },
  {
    step: '03',
    title: 'Formulation match',
    body: 'Symbolic matcher scores classical formulas with grantha references.',
  },
  {
    step: '04',
    title: 'Interaction screen',
    body: 'Classical pairs first, then Random Forest: Synergistic, Caution, or Contraindicated.',
  },
  {
    step: '05',
    title: 'Clinical report',
    body: 'Structured output for practitioner review. Export markdown or PDF.',
  },
];

export const CLASSICAL_TEXTS = [
  'Bhaishajya Ratnavali',
  'Ashtanga Hrudayam',
  'Charaka Samhita',
  'Sharngadhara Samhita',
  'Bhavaprakasha',
  'Sahasrayogam',
];

export const LIMITATIONS_SHORT = [
  {
    title: 'Not full drug-drug checking',
    body: 'Drug-herb conflict uses a focused medication keyword list, not RxNorm/DrugBank DDI.',
  },
  {
    title: 'Formulation match is symbolic',
    body: '176 formulas are scored by symptom and herb overlap, not end-to-end learned retrieval.',
  },
  {
    title: 'Metrics are in-distribution',
    body: '99.98% overall clinical accuracy is template-holdout; free-text OOD may differ.',
  },
  {
    title: 'Educational CDS only',
    body: 'Requires qualified practitioner review. Dosage is model-estimated, not a prescription.',
  },
];

export const HOME_FAQ = [
  {
    q: 'Who is AyurSense for?',
    a: 'Ayurvedic practitioners, clinical researchers, and students who need structured decision support from symptom text - not a consumer self-diagnosis app.',
  },
  {
    q: 'Is this a diagnosis or prescription?',
    a: 'No. AyurSense is educational clinical decision support. A licensed practitioner must review every output before clinical use.',
  },
  {
    q: 'What does a classical citation mean?',
    a: 'When a formulation is matched, AyurSense shows the classical text reference embedded in the V9.2 knowledge bundle (for example Bhaishajya Ratnavali chapter citations).',
  },
  {
    q: 'Why mention medications?',
    a: 'Optional current medications help the drug-herb conflict head flag overlaps with high-risk herbs (for example anticoagulants or insulin with certain botanicals).',
  },
  {
    q: 'What model runs under the hood?',
    a: 'AyurGenix V9.2 merges IndicBERTv2 + LoRA neural heads with a classical kosha of 176 formulations and 704 herb monographs in one deployable checkpoint.',
  },
];

export const MEDICATION_HINT =
  'Optional. Examples: warfarin, anticoagulant, insulin, metformin, blood thinner. Improves drug-herb conflict screening.';
