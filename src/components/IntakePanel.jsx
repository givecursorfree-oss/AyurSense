import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import {
  MEDICATION_HINT,
  PRODUCT_NAME,
} from '@/data/brand-copy';
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
const INTERNAL_EXTERNAL = ['Internal', 'External', 'None'];

export function IntakePanel({
  symptoms,
  setSymptoms,
  season,
  setSeason,
  age,
  setAge,
  gender,
  setGender,
  internalExternal,
  setInternalExternal,
  medications,
  setMedications,
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
    if (symptoms.trim().length < 12) {
      setSymptomsError('Add a bit more detail (at least a short clinical phrase).');
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
            <span className="intake-panel__step font-data">
              {loading ? '…' : step === 1 ? '01' : '02'}
            </span>
            <div className="intake-panel__header-copy min-w-0 flex-1">
              <p className="text-label mb-2">Patient intake</p>
              <h2 className="font-display text-2xl font-light tracking-tight text-inkwell md:text-3xl">
                Clinical <span className="text-dark-stone">analysis</span>
              </h2>
              <p className="intake-panel__lede mt-2 max-w-md text-body-copy text-dark-stone">
                {PRODUCT_NAME}: dosha, herbs, formulation match, interactions,
                and dosage in one pass.
              </p>
            </div>
          </div>
        </header>

        <ol className="intake-stepper" aria-label="Intake progress">
          <li
            className={
              step === 1 && !loading
                ? 'intake-stepper__item--active'
                : step > 1 || loading
                  ? 'intake-stepper__item--done'
                  : ''
            }
            aria-current={step === 1 && !loading ? 'step' : undefined}
          >
            <span className="intake-stepper__dot" aria-hidden="true" />
            1. Symptoms
          </li>
          <li
            className={
              step === 2 && !loading
                ? 'intake-stepper__item--active'
                : loading
                  ? 'intake-stepper__item--done'
                  : ''
            }
            aria-current={step === 2 && !loading ? 'step' : undefined}
          >
            <span className="intake-stepper__dot" aria-hidden="true" />
            2. Context
          </li>
          <li
            className={loading ? 'intake-stepper__item--active' : ''}
            aria-current={loading ? 'step' : undefined}
          >
            <span className="intake-stepper__dot" aria-hidden="true" />
            3. Analyzing
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
              <p id="symptoms-hint" className="intake-field-hint mb-2">
                Focus on presenting complaints. More clinical detail improves
                matching.
              </p>
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
                  placeholder="e.g. joint stiffness in cold weather, dry cough, digestive heat after meals…"
                  className="intake-textarea min-h-[140px] border-0 bg-transparent shadow-none"
                  aria-invalid={symptomsError ? true : undefined}
                  aria-describedby={
                    symptomsError ? 'symptoms-hint symptoms-error' : 'symptoms-hint'
                  }
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

                <div className="intake-field">
                  <span
                    className="intake-field__label text-label"
                    id="internal-external-label"
                  >
                    Internal / External
                    <span className="intake-optional"> Optional</span>
                  </span>
                  <div
                    className="mt-2 flex flex-wrap gap-3"
                    role="group"
                    aria-labelledby="internal-external-label"
                  >
                    {INTERNAL_EXTERNAL.map((opt) => (
                      <label
                        key={opt}
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-dark-stone"
                      >
                        <input
                          type="radio"
                          name="internalExternal"
                          value={opt}
                          checked={internalExternal === opt}
                          onChange={() => setInternalExternal(opt)}
                          disabled={loading}
                        />
                        <span className="font-data">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="intake-field intake-field--full">
                  <label htmlFor="medications" className="intake-field__label text-label">
                    Current medications
                    <span className="intake-optional"> Optional</span>
                  </label>
                  <p id="medications-hint" className="intake-field-hint mb-2">
                    {MEDICATION_HINT}
                  </p>
                  <input
                    id="medications"
                    type="text"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="intake-input"
                    placeholder="e.g. metformin, warfarin"
                    disabled={loading}
                    aria-describedby="medications-hint"
                  />
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
                  Analyzing clinical intake…
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
