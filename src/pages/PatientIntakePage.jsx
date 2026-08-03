import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { analyzePatient, formatApiError } from '@/lib/ayurgenix-api';
import { parseClinicalReport } from '@/lib/parse-clinical-report';
import { enrichClinicalReport } from '@/lib/clinical-enrichment';
import { IntakePanel } from '@/components/IntakePanel';
import { ClinicalReport } from '@/components/ClinicalReport';
import { ReportSkeleton } from '@/components/ReportSkeleton';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { scrollToTarget } from '@/lib/lenis-scroll';
import { scheduleScrollRefresh } from '@/lib/scroll-motion';
import { PRODUCT_NAME } from '@/data/brand-copy';
import { usePageMeta } from '@/hooks/usePageMeta';

export function PatientIntakePage() {
  const [symptoms, setSymptoms] = useState('');
  const [season, setSeason] = useState('Summer');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [internalExternal, setInternalExternal] = useState('None');
  const [medications, setMedications] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const mainRef = useRef(null);
  const reportRef = useRef(null);

  usePageMeta({
    title: 'Patient intake',
    description: `Run ${PRODUCT_NAME} clinical analysis: enter symptoms and review dosha, herbs, cited formulations, and safety flags.`,
    path: '/intake',
  });

  useLayoutEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches
    ) {
      scheduleScrollRefresh();
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from('.intake-page__intro', {
        y: 12,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.from('.intake-panel__shell', {
        y: 16,
        opacity: 0,
        duration: 0.45,
        delay: 0.06,
        ease: 'power3.out',
      });
    }, mainRef);
    scheduleScrollRefresh();
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!report || !reportRef.current) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.report-panel__shell',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      );
      gsap.fromTo(
        '.report-metric',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.1 },
      );
    }, reportRef);

    return () => ctx.revert();
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Enter patient symptoms to continue.');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);
    setSubmitSuccess(false);

    try {
      const contextParts = [];
      if (internalExternal && internalExternal !== 'None') {
        contextParts.push(
          `Predominant pattern: ${internalExternal} (internal or external manifestation).`,
        );
      } else {
        contextParts.push(
          'Predominant pattern: None (internal/external not dominant).',
        );
      }
      if (medications.trim()) {
        contextParts.push(`Current Medications: ${medications.trim()}.`);
      }

      const reportText = await analyzePatient({
        symptoms: `${symptoms}\n\n${contextParts.join('\n')}`,
        season,
        age,
        gender,
      });

      const parsed = parseClinicalReport(reportText);
      const enriched = enrichClinicalReport(parsed, {
        symptomsRaw: symptoms.trim(),
      });
      setReport({
        ...enriched,
        internalExternal,
        medications: medications.trim(),
        season,
        age,
        gender,
      });
      setSubmitSuccess(true);

      setTimeout(() => {
        if (reportRef.current) {
          scrollToTarget(reportRef.current, { offset: -64 });
        }
      }, 150);
    } catch (err) {
      console.error(err);
      setError(
        formatApiError(err) ||
          'Analysis failed. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout page-layout--intake">
      <main
        id="main-content"
        ref={mainRef}
        className="intake-page"
        tabIndex={-1}
      >
        <div className="page-container intake-page__body">
          <div className="intake-page__intro">
            <h1 className="type-page-title">Patient intake</h1>
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Patient intake' },
              ]}
            />
            <p className="intake-page__kicker text-label mt-5">
              {PRODUCT_NAME} · Clinical analysis
            </p>
          </div>

          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {loading
              ? 'Analysis in progress.'
              : submitSuccess
                ? 'Analysis complete. Report ready.'
                : ''}
          </div>

          {submitSuccess && report && (
            <div className="intake-success" role="status">
              <p className="intake-success__title">Analysis complete</p>
              <p className="intake-success__text text-body-copy">
                Your clinical report is ready below. Review interactions marked
                Caution or Contraindicated with a qualified practitioner.
              </p>
            </div>
          )}

          <div className="intake-page__form-wrap">
            <IntakePanel
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              season={season}
              setSeason={setSeason}
              age={age}
              setAge={setAge}
              gender={gender}
              setGender={setGender}
              internalExternal={internalExternal}
              setInternalExternal={setInternalExternal}
              medications={medications}
              setMedications={setMedications}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {loading && (
          <div className="intake-page__report-band">
            <div className="intake-page__report-inner">
              <ReportSkeleton />
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="intake-page__report-band">
            <div className="intake-page__report-inner">
              <ClinicalReport report={report} reportRef={reportRef} />
            </div>
          </div>
        )}

        <SiteFooter intakePage />
      </main>
    </div>
  );
}
