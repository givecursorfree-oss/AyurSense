import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { BrandName } from '@/components/BrandName';
import { IconChevronRight, IconSpark } from '@/components/icons';
import { HowItWorksSteps } from '@/components/HowItWorksSteps';
import { CapabilityTeaser } from '@/components/CapabilityTeaser';
import { PipelineOverview } from '@/components/PipelineOverview';
import { LimitationsTeaser } from '@/components/LimitationsTeaser';
import { HomeFaq } from '@/components/HomeFaq';
import { ClassicalQuoteReveal } from '@/components/ClassicalQuoteReveal';
import { SiteFooter } from '@/components/SiteFooter';
import {
  isMobileViewport,
  prefersReducedMotion,
  scheduleScrollRefresh,
} from '@/lib/scroll-motion';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  CTA_SECONDARY,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HERO_HEADLINE,
  HERO_SUPPORT,
} from '@/data/brand-copy';

export function HomePage() {
  const containerRef = useRef(null);

  usePageMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  });

  useLayoutEffect(() => {
    if (prefersReducedMotion() || isMobileViewport()) {
      scheduleScrollRefresh();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.app-nav', { y: -10, opacity: 0, duration: 0.4 })
        .from('.hero-eyebrow', { y: 8, opacity: 0, duration: 0.35 }, '-=0.15')
        .from('.hero-copy', { y: 16, opacity: 0, duration: 0.45 }, '-=0.2')
        .eventCallback('onComplete', () => scheduleScrollRefresh());
    }, containerRef);

    scheduleScrollRefresh();

    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => scheduleScrollRefresh(), 200);
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
        <section className="hero-atmosphere hero-atmosphere--compact border-b border-light-steel">
          <div className="hero-gradient hero-gradient--center" aria-hidden="true" />

          <div className="hero-content page-container">
            <div className="hero-copy min-w-0 max-w-2xl text-left">
              <p className="hero-eyebrow text-label inline-flex items-center gap-2 border border-light-steel bg-canvas/90 px-3 py-1.5">
                <IconSpark size={14} className="shrink-0 text-ember-orange" />
                Clinical decision support
              </p>
              <h1 className="mt-0">
                <span className="sr-only">AyurSense - </span>
                <BrandName size="lg" className="block" />
                <span className="type-hero-sub mt-4 block pb-1">{HERO_HEADLINE}</span>
              </h1>
              <p className="section-lede">{HERO_SUPPORT}</p>
              <div className="btn-row hero-actions flex flex-wrap items-center">
                <PrimaryCtaLink />
                <Link to="/#how-it-works" className="btn-secondary">
                  {CTA_SECONDARY}
                  <IconChevronRight size={16} className="btn-icon" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HowItWorksSteps />
        <PipelineOverview />
        <CapabilityTeaser />
        <LimitationsTeaser />
        <HomeFaq />
        <ClassicalQuoteReveal />
        <SiteFooter />
      </main>
    </div>
  );
}
