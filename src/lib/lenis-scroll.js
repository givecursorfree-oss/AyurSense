import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/scroll-motion';

gsap.registerPlugin(ScrollTrigger);

/** @type {Lenis | null} */
let lenis = null;

/** @type {((e?: unknown) => void) | null} */
let tickerRaf = null;

const scrollListeners = new Set();

function emitScroll() {
  scrollListeners.forEach((fn) => fn());
}

/**
 * Initialize Lenis smooth scroll + GSAP ScrollTrigger sync.
 * @returns {Lenis | null}
 */
export function initLenis() {
  if (typeof window === 'undefined' || lenis) return lenis;
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    autoRaf: false,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    emitScroll();
  });

  tickerRaf = (time) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerRaf);
  gsap.ticker.lagSmoothing(0);

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
  document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling');
}

export function getLenis() {
  return lenis;
}

/** Subscribe to scroll updates (Lenis or native fallback). */
export function onAppScroll(handler) {
  scrollListeners.add(handler);
  if (!lenis) {
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler, { passive: true });
  }
  return () => {
    scrollListeners.delete(handler);
    if (!lenis) {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    }
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
      duration: immediate ? 0 : 1.15,
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
