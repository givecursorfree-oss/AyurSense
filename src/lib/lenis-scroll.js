import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, shouldUseSmoothScroll } from '@/lib/scroll-motion';

gsap.registerPlugin(ScrollTrigger);

/** @type {Lenis | null} */
let lenis = null;

/** @type {((e?: unknown) => void) | null} */
let tickerRaf = null;

const scrollListeners = new Set();

let scrollEmitRaf = 0;
let nativeScrollBound = false;

function scheduleEmitScroll() {
  if (scrollEmitRaf) return;
  scrollEmitRaf = requestAnimationFrame(() => {
    scrollEmitRaf = 0;
    scrollListeners.forEach((fn) => fn());
  });
}

function onNativeScroll() {
  scheduleEmitScroll();
}

/**
 * Initialize Lenis smooth scroll + GSAP ScrollTrigger sync (desktop only).
 * @returns {Lenis | null}
 */
export function initLenis() {
  if (typeof window === 'undefined' || lenis) return lenis;
  if (!shouldUseSmoothScroll()) {
    if (!nativeScrollBound) {
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', onNativeScroll, { passive: true });
      nativeScrollBound = true;
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return null;
  }

  lenis = new Lenis({
    duration: 0.85,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1,
    syncTouch: false,
    autoRaf: false,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    scheduleEmitScroll();
  });

  tickerRaf = (time) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerRaf);

  document.documentElement.classList.add('lenis', 'lenis-smooth');

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return lenis;
}

export function destroyLenis() {
  if (tickerRaf) {
    gsap.ticker.remove(tickerRaf);
    tickerRaf = null;
  }
  lenis?.destroy();
  lenis = null;
  scrollListeners.clear();
  if (nativeScrollBound) {
    window.removeEventListener('scroll', onNativeScroll);
    window.removeEventListener('resize', onNativeScroll);
    nativeScrollBound = false;
  }
  if (scrollEmitRaf) {
    cancelAnimationFrame(scrollEmitRaf);
    scrollEmitRaf = 0;
  }
  document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling');
}

export function getLenis() {
  return lenis;
}

/** Subscribe to scroll updates (Lenis or native fallback). */
export function onAppScroll(handler) {
  scrollListeners.add(handler);
  if (!lenis) {
    handler();
  }
  return () => {
    scrollListeners.delete(handler);
  };
}

const HEADER_OFFSET = 56;

/**
 * @param {number | string | HTMLElement} target
 * @param {{ offset?: number, immediate?: boolean }} [options]
 */
export function scrollToTarget(target, options = {}) {
  const { offset = -HEADER_OFFSET, immediate = false } = options;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate,
      lock: false,
      duration: immediate ? 0 : 1.05,
    });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }

  const el =
    typeof target === 'string'
      ? document.querySelector(target)
      : target;

  if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function scrollToTop(immediate = false) {
  scrollToTarget(0, { offset: 0, immediate });
}

export function scrollToHash(hash, immediate = false) {
  if (!hash || hash === '#') return;
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (el) scrollToTarget(el, { immediate });
}
