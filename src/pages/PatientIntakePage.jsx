import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { analyzePatient, formatApiError } from '@/lib/ayurgenix-api';
import { parseClinicalReport } from '@/lib/parse-clinical-report';
import { IntakePanel } from '@/components/IntakePanel';
import { ClinicalReport } from '@/components/ClinicalReport';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { scrollToTarget } from '@/lib/lenis-scroll';
import { scheduleScrollRefresh } from '@/lib/scroll-motion';
import { MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';

export function PatientIntakePage() {
  const [symptoms, setSymptoms] = useState('');
  const [season, setSeason] = useState('Summer');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const mainRef = useRef(null);
  const reportRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scheduleScrollRefresh();
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from('.intake-page__intro', {
        y: 12,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.out',
      });
      gsap.from('.intake-panel__shell', {
        y: 20,
        opacity: 0,
        duration: 0.55,
        delay: 0.08,
        ease: 'power3.out',
      });
    }, mainRef);
    scheduleScrollRefresh();
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!report || !reportRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.report-panel__shell',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
      );
      gsap.fromTo(
        '.report-metric',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, delay: 0.15 },
      );
      gsap.fromTo(
        '.report-herb-card',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, delay: 0.5 },
      );
      gsap.fromTo(
        '.report-interaction',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, delay: 0.65 },
      );
      gsap.fromTo(
        '.report-formulation-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.55 },
      );
    }, reportRef);

    return () => ctx.revert();
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter patient symptoms.');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);
    setSubmitSuccess(false);

    try {
      const reportText = await analyzePatient({
        symptoms,
        season,
        age,
        gender,
      });
      setReport(parseClinicalReport(reportText));
      setSubmitSuccess(true);

      setTimeout(() => {
        if (reportRef.current) {
          scrollToTarget(reportRef.current, { offset: -64 });
        }
      }, 150);
    } catch (err) {
      console.error(err);
      setError(formatApiError(err));
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
            <h1 className="sr-only">Patient intake — AyurSense clinical analysis</h1>
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Patient intake' },
              ]}
            />
            <p className="intake-page__kicker text-label mt-4">
              {PRODUCT_NAME} · {MODEL_NAME}
            </p>
          </div>

          {submitSuccess && report && (
            <div className="intake-success" role="status">
              <p className="intake-success__title">Analysis complete</p>
              <p className="intake-success__text text-body-copy">
                Your clinical report is ready below. Review interactions marked
                WARN or DANGER with a qualified practitioner.
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
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
            />

            {report && (
              <ClinicalReport report={report} reportRef={reportRef} />
            )}
          </div>
        </div>

        <SiteFooter intakePage />
      </main>
    </div>
  );
}
