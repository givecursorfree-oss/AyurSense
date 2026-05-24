import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';
import {
  IconAlert,
  IconCalendar,
  IconChevronRight,
  IconHash,
  IconSpinner,
  IconUser,
} from '@/components/icons';

const SEASONS = ['Summer', 'Monsoon', 'Winter', 'Spring', 'Autumn'];
const GENDERS = ['Male', 'Female', 'Other'];

export function IntakePanel({
  symptoms,
  setSymptoms,
  season,
  setSeason,
  age,
  setAge,
  gender,
  setGender,
  loading,
  error,
  onSubmit,
}) {
  const [step, setStep] = useState(1);
  const [symptomsError, setSymptomsError] = useState('');
  const charCount = symptoms.length;

  const goNext = () => {
    if (!symptoms.trim()) {
      setSymptomsError('Describe at least one symptom to continue.');
      return;
    }
    setSymptomsError('');
    setStep(2);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      goNext();
      return;
    }
    onSubmit(e);
  };

  return (
    <section id="intake" className="intake-panel scroll-mt-24">
      <div className="intake-panel__shell">
        <header className="intake-panel__header">
          <div className="intake-panel__header-main">
            <span className="intake-panel__step font-data">01</span>
            <div className="intake-panel__header-copy min-w-0 flex-1">
              <p className="text-label mb-2">Patient intake</p>
              <h2 className="font-display text-2xl font-light tracking-tight text-inkwell md:text-3xl">
                Clinical <span className="text-dark-stone">analysis</span>
              </h2>
              <p className="intake-panel__lede mt-2 max-w-md text-body-copy text-dark-stone">
                {PRODUCT_NAME} runs {MODEL_NAME} — dosha, severity, herb,
                interaction, and dosage inference in one pass.
              </p>
            </div>
          </div>
        </header>

        <ol className="intake-stepper" aria-label="Intake progress">
          <li
            className={step === 1 ? 'intake-stepper__item--active' : step > 1 ? 'intake-stepper__item--done' : ''}
            aria-current={step === 1 ? 'step' : undefined}
          >
            <span className="intake-stepper__dot" aria-hidden="true" />
            Symptoms
          </li>
          <li
            className={step === 2 ? 'intake-stepper__item--active' : ''}
            aria-current={step === 2 ? 'step' : undefined}
          >
            <span className="intake-stepper__dot" aria-hidden="true" />
            Context &amp; submit
          </li>
        </ol>

        <form onSubmit={handleFormSubmit} className="intake-panel__form">
          {step === 1 && (
            <div className="intake-field intake-field--primary">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Label htmlFor="symptoms" className="!mb-0">
                  Clinical symptoms
                </Label>
                <span className="intake-char-count font-data">
                  {charCount > 0 ? `${charCount} chars` : 'Required'}
                </span>
              </div>
              <div className="intake-textarea-wrap">
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value);
                    if (symptomsError && e.target.value.trim()) {
                      setSymptomsError('');
                    }
                  }}
                  placeholder="Describe presenting symptoms in detail — e.g. joint stiffness in cold weather, dry cough, digestive heat after meals…"
                  className="intake-textarea min-h-[140px] border-0 bg-transparent shadow-none"
                  aria-invalid={symptomsError ? true : undefined}
                  aria-describedby={symptomsError ? 'symptoms-error' : undefined}
                  required
                />
              </div>
              {symptomsError && (
                <p id="symptoms-error" className="intake-field-error" role="alert">
                  <IconAlert size={16} className="shrink-0" aria-hidden />
                  {symptomsError}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <div className="intake-symptoms-summary" role="status">
                <p className="text-label mb-1">Symptoms captured</p>
                <p className="intake-symptoms-summary__text text-body-copy">
                  {symptoms.trim()}
                </p>
                <button
                  type="button"
                  className="intake-symptoms-summary__edit"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Edit symptoms
                </button>
              </div>

              <fieldset className="intake-field-grid">
                <legend className="sr-only">Patient context</legend>
                <div className="intake-field">
                  <label htmlFor="season" className="intake-field__label text-label">
                    <IconCalendar size={14} className="intake-field__label-icon" />
                    Season
                  </label>
                  <select
                    id="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="intake-select"
                    disabled={loading}
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="intake-field">
                  <label htmlFor="age" className="intake-field__label text-label">
                    <IconHash size={14} className="intake-field__label-icon" />
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={1}
                    max={120}
                    className="intake-input"
                    disabled={loading}
                  />
                </div>
                <div className="intake-field">
                  <label htmlFor="gender" className="intake-field__label text-label">
                    <IconUser size={14} className="intake-field__label-icon" />
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="intake-select"
                    disabled={loading}
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            </>
          )}

          {error && (
            <div role="alert" className="intake-error">
              <IconAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div
            className={`intake-form-actions${step === 2 ? ' intake-form-actions--split' : ''}`}
          >
            {step === 2 && (
              <button
                type="button"
                className="btn-secondary intake-form-actions__back"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 1 && !symptoms.trim())}
              aria-busy={loading}
              className={`btn-primary intake-submit-btn ${loading ? 'intake-submit-btn--loading' : ''}`}
            >
              {loading ? (
                <>
                  <IconSpinner size={18} />
                  Running {PRODUCT_NAME} inference…
                </>
              ) : step === 1 ? (
                <>
                  Continue
                  <IconChevronRight size={18} />
                </>
              ) : (
                <>
                  Generate clinical report
                  <IconChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="intake-panel__disclaimer">
          <MedicalDisclaimer />
        </div>
      </div>
    </section>
  );
}
