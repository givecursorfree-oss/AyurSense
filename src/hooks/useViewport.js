import { useEffect, useState } from 'react';

/** mobile <768, tablet <1024, else desktop */
export function useViewport() {
  const [viewport, setViewport] = useState(() => getViewport());

  useEffect(() => {
    const onResize = () => setViewport(getViewport());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return viewport;
}

function getViewport() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}
