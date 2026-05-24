import { onAppScroll } from '@/lib/lenis-scroll';

/**
 * Scroll-scrub text reveal — ported from Framer "Text Reveal Scroll Helper"
 * (https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@LirnDto51pVA3JgXzXlM)
 *
 * Characters or words start dim and illuminate progressively as the block scrolls
 * through the viewport (startOffset / endOffset are % of viewport height).
 */

function segmentStyle(dimOpacity, dimColor, litColor) {
  const color = dimColor ? `color:${dimColor};` : '';
  return `display:inline;opacity:${dimOpacity};will-change:opacity,color;${color}`;
}

function wrapChars(el, dimOpacity, dimColor, litColor) {
  const spans = [];

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (!text) return;
      const frag = document.createDocumentFragment();
      for (const char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = segmentStyle(dimOpacity, dimColor);
        span.setAttribute('data-text-reveal-seg', '');
        if (litColor) span.dataset.litColor = litColor;
        spans.push(span);
        frag.appendChild(span);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  }

  walk(el);
  return spans;
}

function wrapWords(el, dimOpacity, dimColor, litColor) {
  const spans = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let n;
  while ((n = walker.nextNode())) {
    const t = n;
    if (t.textContent?.trim()) textNodes.push(t);
  }

  textNodes.forEach((textNode) => {
    const raw = textNode.textContent || '';
    const tokens = raw.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    tokens.forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(token));
        return;
      }
      const span = document.createElement('span');
      span.textContent = token;
      span.style.cssText = segmentStyle(dimOpacity, dimColor);
      span.setAttribute('data-text-reveal-seg', '');
      if (litColor) span.dataset.litColor = litColor;
      spans.push(span);
      frag.appendChild(span);
    });
    textNode.parentNode?.replaceChild(frag, textNode);
  });

  return spans;
}

/**
 * @param {HTMLElement} textEl - Element containing the quote copy
 * @param {object} [options]
 * @returns {() => void} cleanup
 */
export function attachTextRevealScroll(textEl, options = {}) {
  const {
    revealMode = 'words',
    startOffset = 90,
    endOffset = 30,
    dimOpacity = 0.2,
    dimColor = '',
    litColor = '',
    onProgress,
  } = options;

  if (!textEl || typeof window === 'undefined') return () => {};

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const segments =
    revealMode === 'words'
      ? wrapWords(textEl, dimOpacity, dimColor, litColor)
      : wrapChars(textEl, dimOpacity, dimColor, litColor);

  if (segments.length === 0) return () => {};

  const applyLit = (seg, opacity) => {
    seg.style.opacity = String(opacity);
    if (litColor && opacity >= 1) {
      seg.style.color = litColor;
    } else if (dimColor) {
      seg.style.color = dimColor;
    }
  };

  if (reducedMotion) {
    segments.forEach((seg) => applyLit(seg, 1));
    return () => {};
  }

  let startOffsetVal = startOffset;
  let endOffsetVal = endOffset;
  let dimOpacityVal = dimOpacity;

  const updateReveal = () => {
    const rect = textEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const textCenter = rect.top + rect.height / 2;

    // Center-based progress: completes while quote is on screen (not after scrolling past)
    const startCenter = vh * (startOffsetVal / 100);
    const endCenter = vh * (endOffsetVal / 100);
    const centerSpan = startCenter - endCenter;
    let progress =
      centerSpan > 0
        ? (startCenter - textCenter) / centerSpan
        : textCenter <= endCenter
          ? 1
          : 0;

    progress = Math.min(Math.max(progress, 0), 1);

    // Fully lit once the block has passed the reading zone
    if (rect.bottom <= vh * 0.38 || rect.top <= vh * 0.22) {
      progress = 1;
    }

    const total = segments.length;
    const effectiveLit =
      progress >= 0.995 ? total : Math.floor(progress * total);

    segments.forEach((seg, i) => {
      if (i < effectiveLit) {
        applyLit(seg, 1);
      } else if (i === effectiveLit && progress < 0.995) {
        const frac = progress * total - effectiveLit;
        const opacity = dimOpacityVal + frac * (1 - dimOpacityVal);
        applyLit(seg, opacity);
        if (litColor && dimColor && frac > 0) {
          seg.style.color = dimColor;
        }
      } else {
        applyLit(seg, dimOpacityVal);
      }
    });

    if (typeof onProgress === 'function') {
      onProgress(progress);
    }
  };

  updateReveal();
  const unsubscribe = onAppScroll(updateReveal);

  return () => {
    unsubscribe();
  };
}
