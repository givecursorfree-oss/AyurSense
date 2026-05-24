import { AYUR_CAPABILITY_CARDS } from '@/data/capability-cards';
import { CapabilityCards } from '@/components/CapabilityCards';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';

export function CapabilityTeaser() {
  return (
    <section
      id="capabilities"
      className="capabilities-section scroll-mt-24 border-b border-light-steel bg-canvas"
    >
      <div className="capabilities-section__intro page-container pt-10 pb-6 sm:pt-12 md:pt-14 md:pb-8">
        <p className="text-label mb-3">Clinical pipeline</p>
        <h2 className="font-display max-w-2xl text-[clamp(1.5rem,4vw,1.875rem)] font-light leading-tight tracking-tight text-inkwell md:text-3xl">
          Five analyses,{' '}
          <span className="text-dark-stone">one intake</span>
        </h2>
        <p className="mt-3 max-w-2xl text-body-copy text-dark-stone">
          Dosha, herbs, severity, safety screening, and dosage — unified in AyurGenix V9, with
          formulations aligned to classical Ayurvedic compendia.
        </p>
      </div>

      <CapabilityCards cards={AYUR_CAPABILITY_CARDS} />

      <div className="capabilities-section__cta page-container pb-12 pt-4 md:pb-14">
        <PrimaryCtaLink />
      </div>
    </section>
  );
}
