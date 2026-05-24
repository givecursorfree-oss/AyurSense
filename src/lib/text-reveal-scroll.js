import { onAppScroll } from '@/lib/lenis-scroll';

/**
 * Scroll-scrub text reveal — ported from Framer "Text Reveal Scroll Helper"
 * (https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@LirnDto51pVA3JgXzXlM)
 *
 * Characters or words start dim and illuminate progressively as the block scrolls
 * through the viewport (startOffset / endOffset are % of viewport height).
 */

function parseHexColor(hex) {
  const raw = hex.replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function blendHexColors(from, to, amount) {
  const t = Math.min(Math.max(amount, 0), 1);
  const [r1, g1, b1] = parseHexColor(from);
  const [r2, g2, b2] = parseHexColor(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function segmentStyle(dimOpacity, dimColor) {
  const color = dimColor ? `color:${dimColor};` : '';
  return `display:inline;opacity:${dimOpacity};${color}`;
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
        span.style.cssText = segmentStyle(dimOpacity, dimColor, litColor);
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
    snapCompleteEarly = true,
    /** 'top' tracks element top (longer, clearer scrub); 'center' uses vertical center */
    progressBy = 'center',
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

  /** @param {number} blend 0 = dim, 1 = fully lit */
  const applyLit = (seg, blend) => {
    const t = Math.min(Math.max(blend, 0), 1);
    // Ease-in so the “lighting up” reads clearly mid-scroll, not only at the end
    const eased = t * t * (3 - 2 * t);

    if (litColor && dimColor) {
      seg.style.opacity = String(dimOpacityVal + eased * (1 - dimOpacityVal));
      seg.style.color = blendHexColors(dimColor, litColor, eased);
      seg.style.fontWeight = eased >= 0.92 ? '500' : '300';
      return;
    }
    const opacity = dimOpacityVal + eased * (1 - dimOpacityVal);
    seg.style.opacity = String(opacity);
    if (litColor && eased >= 1) {
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
  let lastEffectiveLit = -1;
  let lastProgressKey = -1;

  const paintSegment = (index, progress) => {
    const total = segments.length;
    const effectiveLit =
      progress >= 0.995 ? total : Math.floor(progress * total);

    if (index < effectiveLit) {
      applyLit(segments[index], 1);
      return;
    }
    if (index === effectiveLit && progress < 0.995) {
      applyLit(segments[index], progress * total - effectiveLit);
      return;
    }
    applyLit(segments[index], 0);
  };

  const updateReveal = () => {
    const rect = textEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const startLine = vh * (startOffsetVal / 100);
    const endLine = vh * (endOffsetVal / 100);
    const span = startLine - endLine;

    const anchor =
      progressBy === 'top' ? rect.top : rect.top + rect.height / 2;

    let progress =
      span > 0 ? (startLine - anchor) / span : anchor <= endLine ? 1 : 0;

    progress = Math.min(Math.max(progress, 0), 1);

    if (
      snapCompleteEarly &&
      (rect.bottom <= vh * 0.38 || rect.top <= vh * 0.22)
    ) {
      progress = 1;
    }

    const total = segments.length;
    const effectiveLit =
      progress >= 0.995 ? total : Math.floor(progress * total);
    const progressKey = Math.round(progress * 120);

    if (
      progressKey === lastProgressKey &&
      effectiveLit === lastEffectiveLit
    ) {
      return;
    }

    if (lastEffectiveLit < 0) {
      for (let i = 0; i < total; i += 1) {
        paintSegment(i, progress);
      }
    } else {
      const from = Math.min(lastEffectiveLit, effectiveLit);
      const to = Math.max(lastEffectiveLit, effectiveLit) + 1;
      for (let i = from; i <= Math.min(to, total - 1); i += 1) {
        paintSegment(i, progress);
      }
      if (effectiveLit < total) {
        paintSegment(effectiveLit, progress);
      }
    }

    lastEffectiveLit = effectiveLit;
    lastProgressKey = progressKey;

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
