import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { scheduleScrollRefresh } from '@/lib/scroll-motion';
import {
  destroyLenis,
  initLenis,
  scrollToHash,
  scrollToTop,
} from '@/lib/lenis-scroll';
import { AstraPreloader } from '@/components/AstraPreloader';
import { AppHeader } from '@/components/AppHeader';
import { SkipLink } from '@/components/SkipLink';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const PatientIntakePage = lazy(() =>
  import('@/pages/PatientIntakePage').then((m) => ({ default: m.PatientIntakePage })),
);

const JourneyPage = lazy(() =>
  import('@/pages/JourneyPage').then((m) => ({ default: m.JourneyPage })),
);
import { configureScrollMotion } from '@/lib/scroll-motion';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { HOME_SCROLL_SECTIONS } from '@/data/site-nav';
import './App.css';

function AppShell() {
  const location = useLocation();
  const onIntake = location.pathname === '/intake';
  const onHome = location.pathname === '/';
  const activeSection = useScrollSpy(onHome ? HOME_SCROLL_SECTIONS : [], 140);

  useEffect(() => {
    const onAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToHash(href);
    };

    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const t = window.setTimeout(() => {
        scrollToHash(location.hash);
        scheduleScrollRefresh();
      }, 80);
      return () => window.clearTimeout(t);
    }

    scrollToTop(true);

    const t = window.setTimeout(() => scheduleScrollRefresh(), 120);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <>
      <SkipLink />
      <AppHeader showReportLink={onIntake} activeSection={activeSection} />
      <Suspense
        fallback={
          <main className="page-container py-24 text-center text-dark-stone">
            Loading…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/intake" element={<PatientIntakePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!appReady) return;
    configureScrollMotion();
    initLenis();
    return () => destroyLenis();
  }, [appReady]);

  if (!appReady) {
    return (
      <AstraPreloader onComplete={() => setAppReady(true)} />
    );
  }

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
