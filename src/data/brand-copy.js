/** Product naming - AyurSense (product) · AyurGenix V9.2 (model/API) */
export const PRODUCT_NAME = 'AyurSense';
export const MODEL_NAME = 'AyurGenix V9.2';
export const MODEL_SHORT = 'V9.2';

export const SITE_URL = 'https://ayursense.vercel.app';

export const DEFAULT_TITLE = 'AyurSense - Ayurvedic Clinical Decision Support';
export const DEFAULT_DESCRIPTION =
  'Clinical decision support for Ayurveda: symptoms to dosha, herbs, cited formulations, and safety flags for practitioner review.';

export const MEDICAL_DISCLAIMER =
  'For research and educational clinical decision support only. Not a substitute for diagnosis, treatment, or advice from a licensed physician or qualified Ayurvedic practitioner.';

export const SCOPE_CAVEAT =
  'Outputs vary with free-text wording and case context. Always review with a qualified practitioner before clinical use.';

export const HERO_HEADLINE = 'From symptoms to a citation-backed clinical report';
export const HERO_SUPPORT =
  'Structured intake. AyurSense returns dosha, herbs, cited formulations, and safety flags for practitioner review.';

export const CTA_PRIMARY = 'Start patient intake';
export const CTA_SECONDARY = 'See how it works';

export const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Patient intake',
    body: 'Symptoms, season, age, gender, and optional medications.',
  },
  {
    step: '02',
    title: 'Clinical analysis',
    body: 'Dosha, herbs, severity, safety, and dosage guidance from the intake.',
  },
  {
    step: '03',
    title: 'Formulation match',
    body: 'Classical formulas scored against the case for practitioner review.',
  },
  {
    step: '04',
    title: 'Interaction screen',
    body: 'Herb interaction flags: Synergistic, Caution, or Contraindicated.',
  },
  {
    step: '05',
    title: 'Clinical report',
    body: 'Structured output for practitioner review. Export markdown or PDF.',
  },
];

export const LIMITATIONS_SHORT = [
  {
    title: 'Not full drug-drug checking',
    body: 'Medication screening uses a focused keyword list, not a full pharmacy DDI database.',
  },
  {
    title: 'Formulation match is assistive',
    body: 'Matched formulas are ranked suggestions for review, not automatic prescriptions.',
  },
  {
    title: 'Case wording matters',
    body: 'Free-text intake can change outputs. Treat every report as decision support, not a fixed score.',
  },
  {
    title: 'Educational CDS only',
    body: 'Requires qualified practitioner review. Dosage is estimated, not a prescription.',
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
    a: 'When a formulation is matched, AyurSense shows the classical reference associated with that suggestion for practitioner review.',
  },
  {
    q: 'Why mention medications?',
    a: 'Optional current medications help flag possible herb overlaps with high-risk drug classes for practitioner review.',
  },
];

export const MEDICATION_HINT =
  'Optional. Examples: warfarin, anticoagulant, insulin, metformin, blood thinner. Improves drug-herb conflict screening.';
