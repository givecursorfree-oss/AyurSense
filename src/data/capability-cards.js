import { thiingsIconUrl } from '@/data/thiings-icons';

/** AyurSense capability cards — Thiings icons + clinical pipeline copy */
export const AYUR_CAPABILITY_CARDS = [
  {
    id: 'dosha',
    title: 'DOSHA INFERENCE',
    description: 'Ayurvedic herbs and botanical ingredients for constitutional balance.',
    thiingsSlug: 'basil',
    icon: {
      src: thiingsIconUrl('KTRriZAzZkfE3TC9VHqLNa5gPKr1Gc'),
      alt: 'Basil herb — Thiings icon',
    },
  },
  {
    id: 'herbs',
    title: 'HERB RECOMMENDATION',
    description: 'Traditional Ayurvedic preparation aligned to your intake profile.',
    thiingsSlug: 'pesto',
    icon: {
      src: thiingsIconUrl('mIZnLGxOWolWvOe24DfCZYH8lc0BTg'),
      alt: 'Herbal condiment — Thiings pesto icon',
    },
  },
  {
    id: 'severity',
    title: 'SEVERITY SCORING',
    description: 'Clinical health assessment scored from symptom patterns.',
    thiingsSlug: 'stethoscope',
    icon: {
      src: thiingsIconUrl('YM427q0rp7oBdrNFxZLbdSyYBZNTjA'),
      alt: 'Stethoscope — clinical assessment icon',
    },
  },
  {
    id: 'safety',
    title: 'DRUG SAFETY',
    description: 'Pharmaceutical safety review and herb-herb interaction screening.',
    thiingsSlug: 'pharmacy',
    icon: {
      src: thiingsIconUrl('6wMF08KL3k63lcTffQtNl21e7rnvlZ'),
      alt: 'Pharmacy — drug safety icon',
    },
  },
  {
    id: 'dosage',
    title: 'DOSAGE GUIDANCE',
    description: 'Wellness and dosage guidance calibrated to severity and dosha.',
    thiingsSlug: 'measuring-cup',
    icon: {
      src: thiingsIconUrl('I8ariMAxOg6J8QwtXZzlU3jux97ZuG'),
      alt: 'Measuring cup — dosage guidance icon',
    },
  },
];

/** Signature capability — classical text–grounded formulation (featured card) */
export const AYUR_CLASSICAL_FORMULATION_CARD = {
  id: 'classical-formulation',
  badge: 'AyurGenix signature',
  title: 'CLASSICAL FORMULATION ALIGNMENT',
    description:
    'AyurSense matches formulations grounded in classical sources - not generic herb lists.',
  highlights: ['Cited suggestions', 'Practitioner review'],
  thiingsSlug: 'potions-book',
  icon: {
    src: thiingsIconUrl('nJa8u8YodOrRhi7VeQkbYIzL6C6bsA'),
    alt: 'Potions book — classical formulation compendium icon from Thiings',
  },
};
