/** Image URLs — local assets in /public/images; Unsplash for other slots until replaced */

export const CLINICAL_INSIGHT_ALT =
  'Ayurvedic herbs and spices prepared in a stone mortar with fresh ingredients';

/** Local clinical herb image (How it works step 02, herbs capability, journey fallbacks) */
export const CLINICAL_INSIGHT_IMAGE = '/images/clinical-insight-herbs.png';

export const IMAGE_FALLBACK = CLINICAL_INSIGHT_IMAGE;

/** Journey card photos (verified Unsplash 200) */
export const JOURNEY_DINACHARYA_IMAGE =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80';

export const JOURNEY_YOGA_IMAGE =
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80';

/** Remote fallbacks (used until local WebP/JPG files are added under public/images) */
export const JOURNEY_IMAGE_FALLBACKS = {
  dinacharya: JOURNEY_YOGA_IMAGE,
  doshaBalance: CLINICAL_INSIGHT_IMAGE,
  ritucharya:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  herbSafety: JOURNEY_DINACHARYA_IMAGE,
};

export const HOW_IT_WORKS_IMAGES = {
  symptoms: {
    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    alt: 'Clinician reviewing patient symptoms during consultation',
  },
  inference: {
    src: CLINICAL_INSIGHT_IMAGE,
    alt: CLINICAL_INSIGHT_ALT,
  },
  report: {
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    alt: 'Structured clinical health report and assessment',
  },
};

export const CAPABILITY_IMAGE_FALLBACKS = {
  dosha: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  herbs: CLINICAL_INSIGHT_IMAGE,
  severity: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
  safety: JOURNEY_DINACHARYA_IMAGE,
  dosage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
};

export function journeyImageSrc(key) {
  return JOURNEY_IMAGE_FALLBACKS[key] ?? JOURNEY_IMAGE_FALLBACKS.dinacharya;
}

export function capabilityImageSrc(key) {
  return CAPABILITY_IMAGE_FALLBACKS[key];
}
