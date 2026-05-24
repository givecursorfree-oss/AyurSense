import { MEDICAL_DISCLAIMER } from '@/data/brand-copy';

export function MedicalDisclaimer({ compact = false, className = '' }) {
  return (
    <aside
      className={`medical-disclaimer ${compact ? 'medical-disclaimer--compact' : ''} ${className}`.trim()}
      role="note"
    >
      <p className="medical-disclaimer__text">{MEDICAL_DISCLAIMER}</p>
    </aside>
  );
}
