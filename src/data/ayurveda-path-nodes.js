import { journeyImageSrc } from '@/data/media';

const JOURNEY_IMAGES = {
  dinacharya: {
    src: journeyImageSrc('dinacharya'),
    alt: 'Person practicing yoga outdoors for daily Ayurvedic routine',
  },
  doshaBalance: {
    src: journeyImageSrc('doshaBalance'),
    alt: 'Ayurvedic herbs and dried botanicals',
  },
  ritucharya: {
    src: journeyImageSrc('ritucharya'),
    alt: 'Seasonal fresh produce and balanced meals',
  },
  herbSafety: {
    src: journeyImageSrc('herbSafety'),
    alt: 'Ayurvedic daily rhythm and wellness practices',
  },
};

/** Nodes along the clinical journey path */
export const AYURVEDA_PATH_NODES = [
  {
    id: 'dinacharya',
    type: 'tip',
    step: '01',
    title: 'Dinacharya — daily rhythm',
    teaser: 'Align sleep, meals, and movement with natural cycles before clinical intake.',
    pathProgress: 0.18,
    image: JOURNEY_IMAGES.dinacharya.src,
    imageAlt: JOURNEY_IMAGES.dinacharya.alt,
    article:
      'Ayurveda treats consistent daily routine as preventive medicine. A steady wake time, main meal at midday when Agni is strongest, and wind-down before 10 p.m. help stabilise Vata and support accurate symptom reporting.',
    dos: [
      'Wake before sunrise when possible; hydrate with warm water.',
      'Eat your largest meal at midday; keep dinner light and early.',
      'Include gentle movement — walking or yoga — for 20–30 minutes daily.',
    ],
    donts: [
      'Skip breakfast or eat heavy food late at night.',
      'Use screens during the last hour before sleep.',
      'Suppress natural urges (hunger, thirst, rest) habitually.',
    ],
  },
  {
    id: 'symptoms',
    type: 'pipeline',
    step: '02',
    title: 'Clinical symptoms',
    teaser: 'Describe signs, season, age, and gender — the model’s starting point.',
    pathProgress: 0.28,
  },
  {
    id: 'dosha-balance',
    type: 'tip',
    step: '03',
    title: 'Dosha balance basics',
    teaser: 'Vata, Pitta, and Kapha patterns guide both lifestyle and herb selection.',
    pathProgress: 0.4,
    image: JOURNEY_IMAGES.doshaBalance.src,
    imageAlt: JOURNEY_IMAGES.doshaBalance.alt,
    article:
      'Imbalance is rarely single-dosha. Vata excess may show as dryness and anxiety; Pitta as heat and inflammation; Kapha as heaviness and congestion. AyurSense maps your symptom narrative to these patterns automatically.',
    dos: [
      'Note when symptoms worsen (cold weather, stress, after meals).',
      'Mention digestion, sleep quality, and mood in your intake text.',
      'Share any current herbs or medications for interaction screening.',
    ],
    donts: [
      'List only one symptom — context improves inference quality.',
      'Mix unrelated acute issues without noting onset or duration.',
      'Assume a single “dominant dosha” without seasonal context.',
    ],
  },
  {
    id: 'dosha-inference',
    type: 'pipeline',
    step: '04',
    title: 'Dosha inference',
    teaser: 'Classification of prakriti imbalance from your narrative.',
    pathProgress: 0.52,
  },
  {
    id: 'ritucharya',
    type: 'tip',
    step: '05',
    title: 'Ritucharya — seasonal care',
    teaser: 'Summer, monsoon, and winter each shift recommended diet and herbs.',
    pathProgress: 0.64,
    image: JOURNEY_IMAGES.ritucharya.src,
    imageAlt: JOURNEY_IMAGES.ritucharya.alt,
    article:
      'Season is a first-class input in AyurSense. Monsoon increases Kapha and Ama; summer aggravates Pitta; winter can dry Vata. Matching intake season to real climate improves dosage and herb ranking.',
    dos: [
      'Select the season that matches the patient’s current climate.',
      'Favour cooling foods in Pitta season; warming oils in Vata season.',
      'Adjust herb potency expectations when humidity is high (monsoon).',
    ],
    donts: [
      'Ignore season — it materially changes herb and dosage outputs.',
      'Use heating spices aggressively during peak summer without indication.',
      'Treat “Spring” and “Autumn” as identical to summer or winter.',
    ],
  },
  {
    id: 'herbs-safety',
    type: 'tip',
    step: '06',
    title: 'Herb safety & interactions',
    teaser: 'Botanical choices are screened for herb–herb and herb–drug conflicts.',
    pathProgress: 0.76,
    image: JOURNEY_IMAGES.herbSafety.src,
    imageAlt: JOURNEY_IMAGES.herbSafety.alt,
    article:
      'Classical combinations still require context. AyurSense flags pharmacological conflicts and toxicity bands before recommendations appear in your report.',
    dos: [
      'Disclose prescription medicines and supplements in symptom notes.',
      'Review interaction cards marked DANGER or WARN in the report.',
      'Prefer single-herb trials when history of drug sensitivity exists.',
    ],
    donts: [
      'Combine new herbs with blood thinners without professional review.',
      'Assume “natural” equals safe with pregnancy or chronic illness.',
      'Override dosage guidance in the report without clinician input.',
    ],
  },
  {
    id: 'herb-dosage',
    type: 'pipeline',
    step: '07',
    title: 'Herbs, safety & dosage',
    teaser: 'Recommendations, interaction checks, and safe ranges in one pass.',
    pathProgress: 0.88,
  },
  {
    id: 'report',
    type: 'pipeline',
    step: '08',
    title: 'Structured clinical report',
    teaser: 'Dosha, severity, herbs, interactions, and dosage — unified output.',
    pathProgress: 0.97,
  },
];
