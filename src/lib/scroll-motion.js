import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Smooth scrub lag (seconds) - lower = snappier, less trailing lag */
export const ST_SCRUB_SMOOTH = 0.35;

let configured = false;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Matches project mobile shell (≤767px) or touch-primary devices. */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

/** Lenis + heavy scrub hurt touch scrolling; use native scroll instead. */
export function shouldUseSmoothScroll() {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (isMobileViewport()) return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  return true;
}

export function configureScrollMotion() {
  if (configured || typeof window === 'undefined') return;
  configured = true;

  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });

  if (shouldUseSmoothScroll()) {
    gsap.ticker.lagSmoothing(500, 33);
  }
}

let refreshRaf = 0;

/** Debounced refresh to avoid layout thrash from multiple ST instances */
export function scheduleScrollRefresh() {
  if (typeof window === 'undefined') return;
  if (refreshRaf) cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    refreshRaf = 0;
    ScrollTrigger.refresh();
  });
}
