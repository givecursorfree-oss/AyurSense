import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { BrandName } from '@/components/BrandName';
import { IconSpark } from '@/components/icons';
import { CounterStatCard, MODEL_STATS } from '@/components/CounterStatCard';
import { HowItWorksSteps } from '@/components/HowItWorksSteps';
import { CapabilityTeaser } from '@/components/CapabilityTeaser';
import { ClassicalQuoteReveal } from '@/components/ClassicalQuoteReveal';
import { SiteFooter } from '@/components/SiteFooter';
import { scheduleScrollRefresh } from '@/lib/scroll-motion';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';

export function HomePage() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scheduleScrollRefresh();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.app-nav', { y: -12, opacity: 0, duration: 0.5 })
        .from('.hero-eyebrow', { y: 10, opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-copy', { y: 20, opacity: 0, duration: 0.6 }, '-=0.25')
        .from('.stat-card', { y: 24, opacity: 0, scale: 0.96, duration: 0.5, stagger: 0.08 }, '-=0.2')
        .eventCallback('onComplete', () => scheduleScrollRefresh());
    }, containerRef);

    scheduleScrollRefresh();

    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => scheduleScrollRefresh(), 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div className="page-layout font-ui" ref={containerRef}>
      <main id="main-content" className="site-main" tabIndex={-1}>
        <section className="hero-atmosphere border-b border-light-steel pb-12 pt-10 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16">
          <div className="hero-gradient hero-gradient--violet" aria-hidden="true" />
          <div className="hero-gradient hero-gradient--ember" aria-hidden="true" />
          <div className="hero-gradient hero-gradient--center" aria-hidden="true" />

          <div className="hero-content page-container grid gap-10 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
            <div className="hero-copy min-w-0 text-left">
              <p className="hero-eyebrow text-label mb-4 inline-flex items-center gap-2 rounded-full border border-light-steel bg-canvas/80 px-3 py-1.5 backdrop-blur-sm sm:mb-5">
                <IconSpark size={14} className="shrink-0 text-ember-orange" />
                Ayurvedic clinical intelligence
              </p>
              <h1 className="font-display text-[1.875rem] font-light leading-[1.08] tracking-tight text-inkwell sm:text-[2.25rem] md:text-5xl">
                <BrandName size="lg" className="block mb-2 sm:mb-3" />
                <span className="text-dark-stone mt-1 block text-[0.7em] font-normal sm:text-[0.65em] md:text-[0.55em]">
                  Predictive medicine, one intake
                </span>
              </h1>
              <p className="mt-4 max-w-md text-body-copy text-dark-stone sm:mt-5">
                AyurSense runs AyurGenix V9 — multi-task inference, classical
                formulation alignment, and herb–herb screening via IndicBERTv2 +
                LoRA.
              </p>
              <div className="btn-row hero-actions mt-6 sm:mt-8">
                <PrimaryCtaLink />
              </div>
            </div>

            <div id="performance" className="hero-metrics scroll-mt-24 w-full min-w-0">
              <p className="text-label mb-3 sm:mb-4">Model performance</p>
              <div className="stats-grid">
                {MODEL_STATS.map((stat) => (
                  <CounterStatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <HowItWorksSteps />

        <CapabilityTeaser />

        <ClassicalQuoteReveal />

        <SiteFooter />
      </main>
    </div>
  );
}
