import { AYUR_CAPABILITY_CARDS } from '@/data/capability-cards';
import { CapabilityCards } from '@/components/CapabilityCards';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';

export function CapabilityTeaser() {
  return (
    <section
      id="capabilities"
      className="capabilities-section scroll-mt-24 border-b border-light-steel bg-canvas"
    >
      <div className="page-container capabilities-section__intro">
        <div className="section-header mb-0">
          <h2 className="section-heading">
            Clinical analyses,{' '}
            <span className="section-heading__muted">one intake</span>
          </h2>
          <p className="section-lede">
            Dosha, herbs, severity, safety, and dosage guidance in one
            practitioner-facing report.
          </p>
        </div>
      </div>

      <CapabilityCards cards={AYUR_CAPABILITY_CARDS} />

      <div className="capabilities-section__cta page-container">
        <PrimaryCtaLink />
      </div>
    </section>
  );
}
