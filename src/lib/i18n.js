/**
 * i18n translations for AyurGenixV8 UI
 * Supports: English (en), Hindi (hi), Sanskrit (sa)
 */

const translations = {
  en: {
    // Nav
    capabilities: 'Capabilities',
    pipeline: 'Pipeline',
    intake: 'Intake',
    report: 'Report',
    newAnalysis: 'New analysis',

    // Hero
    eyebrow: 'Ayurvedic clinical intelligence',
    heroSubtitle: 'Predictive medicine, one intake',
    heroDescription: 'Multi-task inference across dosha, severity, herbs, interactions, and dosage — powered by IndicBERTv2 + LoRA on Hugging Face.',
    startAnalysis: 'Start clinical analysis',
    modelPerformance: 'Model performance',

    // Stats
    herbAccuracy: 'Herb Accuracy',
    doshaClassification: 'Dosha Classification',
    drugConflictF1: 'Drug Conflict F1',
    dosageMAE: 'Dosage MAE',

    // Intake Form
    patientIntake: 'Patient Intake',
    intakeDescription: 'Enter clinical parameters for AI-powered Ayurvedic analysis',
    clinicalSymptoms: 'Clinical Symptoms',
    symptomsPlaceholder: 'e.g., Joint pain, swelling in cold weather, persistent dry cough...',
    season: 'Season',
    selectSeason: 'Select Season',
    summer: 'Summer',
    monsoon: 'Monsoon',
    winter: 'Winter',
    spring: 'Spring',
    autumn: 'Autumn',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    executeDiagnosis: 'Execute Clinical Diagnosis',
    analyzing: 'Analyzing Clinical Data...',
    enterSymptoms: 'Please enter patient symptoms.',

    // Report
    clinicalReport: 'Clinical Intelligence Report',
    doshaImbalance: 'Dosha Imbalance',
    severity: 'Severity',
    safeDosage: 'Safe Dosage',
    toxicityLevel: 'Toxicity Level',
    sideEffects: 'Side Effects',
    drugSafety: 'Drug Safety',
    recommendedHerbs: 'Recommended Botanical Profile',
    interactions: 'Pharmacological Interactions',

    // Footer
    footerText: 'Multi-Task Deep Learning for Ayurvedic Clinical Intelligence',

    // Language
    language: 'Language',
  },
  hi: {
    // Nav
    capabilities: 'क्षमताएँ',
    pipeline: 'पाइपलाइन',
    intake: 'परीक्षण',
    report: 'रिपोर्ट',
    newAnalysis: 'नई जाँच',

    // Hero
    eyebrow: 'आयुर्वेदिक नैदानिक बुद्धिमत्ता',
    heroSubtitle: 'एक परीक्षण में पूर्वानुमानित चिकित्सा',
    heroDescription: 'दोष, गंभीरता, जड़ी-बूटी, परस्पर क्रिया और खुराक में बहु-कार्य अनुमान — IndicBERTv2 + LoRA द्वारा संचालित।',
    startAnalysis: 'नैदानिक विश्लेषण शुरू करें',
    modelPerformance: 'मॉडल प्रदर्शन',

    // Stats
    herbAccuracy: 'जड़ी-बूटी सटीकता',
    doshaClassification: 'दोष वर्गीकरण',
    drugConflictF1: 'औषध संघर्ष F1',
    dosageMAE: 'खुराक MAE',

    // Intake Form
    patientIntake: 'रोगी परीक्षण',
    intakeDescription: 'AI-संचालित आयुर्वेदिक विश्लेषण हेतु नैदानिक पैरामीटर दर्ज करें',
    clinicalSymptoms: 'नैदानिक लक्षण',
    symptomsPlaceholder: 'उदा., जोड़ों में दर्द, ठंड में सूजन, लगातार सूखी खाँसी...',
    season: 'ऋतु',
    selectSeason: 'ऋतु चुनें',
    summer: 'ग्रीष्म (गर्मी)',
    monsoon: 'वर्षा',
    winter: 'शीत (सर्दी)',
    spring: 'वसंत',
    autumn: 'शरद',
    age: 'आयु',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    executeDiagnosis: 'नैदानिक निदान चलाएँ',
    analyzing: 'नैदानिक डेटा विश्लेषण हो रहा है...',
    enterSymptoms: 'कृपया रोगी के लक्षण दर्ज करें।',

    // Report
    clinicalReport: 'नैदानिक बुद्धिमत्ता रिपोर्ट',
    doshaImbalance: 'दोष असंतुलन',
    severity: 'गंभीरता',
    safeDosage: 'सुरक्षित खुराक',
    toxicityLevel: 'विषाक्तता स्तर',
    sideEffects: 'दुष्प्रभाव',
    drugSafety: 'औषध सुरक्षा',
    recommendedHerbs: 'अनुशंसित वानस्पतिक प्रोफ़ाइल',
    interactions: 'औषधीय परस्पर क्रिया',

    // Footer
    footerText: 'आयुर्वेदिक नैदानिक बुद्धिमत्ता हेतु बहु-कार्य गहन शिक्षण',

    // Language
    language: 'भाषा',
  },
  sa: {
    // Nav
    capabilities: 'क्षमताः',
    pipeline: 'प्रक्रिया',
    intake: 'परीक्षणम्',
    report: 'प्रतिवेदनम्',
    newAnalysis: 'नवीनं परीक्षणम्',

    // Hero
    eyebrow: 'आयुर्वेदीय चिकित्सा बुद्धिमत्ता',
    heroSubtitle: 'एकस्मिन् परीक्षणे पूर्वानुमानित चिकित्सा',
    heroDescription: 'दोष-तीव्रता-औषधि-परस्परक्रिया-मात्रासु बहुकार्यानुमानम् — IndicBERTv2 + LoRA इत्यनेन संचालितम्।',
    startAnalysis: 'चिकित्सा विश्लेषणम् आरभताम्',
    modelPerformance: 'प्रतिरूप प्रदर्शनम्',

    // Stats
    herbAccuracy: 'औषधि सटीकता',
    doshaClassification: 'दोष वर्गीकरणम्',
    drugConflictF1: 'औषध संघर्ष F1',
    dosageMAE: 'मात्रा MAE',

    // Intake Form
    patientIntake: 'रोगी परीक्षणम्',
    intakeDescription: 'AI-संचालित आयुर्वेदीय विश्लेषणाय नैदानिक मापदण्डाः प्रविष्टयन्ताम्',
    clinicalSymptoms: 'नैदानिक लक्षणानि',
    symptomsPlaceholder: 'यथा, सन्धिशूलम्, शीते शोथः, सततं शुष्ककासः...',
    season: 'ऋतुः',
    selectSeason: 'ऋतुं चिनुत',
    summer: 'ग्रीष्मः',
    monsoon: 'वर्षाः',
    winter: 'शिशिरः',
    spring: 'वसन्तः',
    autumn: 'शरद्',
    age: 'वयः',
    gender: 'लिङ्गम्',
    male: 'पुरुषः',
    female: 'स्त्री',
    other: 'अन्यत्',
    executeDiagnosis: 'निदानम् आरभताम्',
    analyzing: 'नैदानिक दत्तांशः विश्लिष्यते...',
    enterSymptoms: 'कृपया रोगिणः लक्षणानि प्रविशन्तु।',

    // Report
    clinicalReport: 'नैदानिक बुद्धिमत्ता प्रतिवेदनम्',
    doshaImbalance: 'दोषवैषम्यम्',
    severity: 'तीव्रता',
    safeDosage: 'सुरक्षिता मात्रा',
    toxicityLevel: 'विषाक्तता स्तरः',
    sideEffects: 'पार्श्वप्रभावाः',
    drugSafety: 'औषध सुरक्षा',
    recommendedHerbs: 'अनुशंसित वनौषधि प्रोफाइल',
    interactions: 'औषधीय परस्परक्रियाः',

    // Footer
    footerText: 'आयुर्वेदीय नैदानिक बुद्धिमत्तायै बहुकार्य गभीर शिक्षणम्',

    // Language
    language: 'भाषा',
  },
};

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sa', label: 'संस्कृतम्', flag: '🕉️' },
];

/**
 * @param {string} lang - Language code (en, hi, sa)
 * @param {string} key - Translation key
 * @returns {string}
 */
export function t(lang, key) {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export default translations;
