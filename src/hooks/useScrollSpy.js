import { useEffect, useState } from 'react';
import { onAppScroll } from '@/lib/lenis-scroll';

/**
 * Highlights nav id matching the section nearest the top of the viewport.
 * @param {string[]} sectionIds - e.g. ['capabilities', 'how-it-works']
 */
export function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const update = () => {
      if (window.scrollY < 96) {
        setActiveId('');
        return;
      }

      let current = '';
      let best = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= offset && offset - top < best) {
          best = offset - top;
          current = id;
        }
      });

      setActiveId(current);
    };

    update();
    return onAppScroll(update);
  }, [sectionIds, offset]);

  return activeId;
}
