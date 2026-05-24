import { SignatureStroke } from '@/components/SignatureStroke';
import { TEAM_SIGNATURE, AYURSENSE_SIGNATURE } from '@/data/signature-paths';

/**
 * Scroll-driven signature — phase controlled by ClassicalQuoteReveal progress.
 * @param {'idle' | 'start' | 'end'} phase
 */
export function SignComponent({ phase = 'idle' }) {
  const showTeam = phase === 'start' || phase === 'end';
  const showAyurSense = phase === 'end';

  return (
    <div className="sign-component">
      <div
        className={`sign-component__stage${showAyurSense ? ' sign-component__stage--complete' : ''}`}
        aria-hidden="true"
      >
        {showTeam && (
          <div className="sign-component__word sign-component__word--team">
            <SignatureStroke
              signature={TEAM_SIGNATURE}
              active={showTeam}
              className="sign-component__svg sign-component__svg--team"
            />
          </div>
        )}
        {showAyurSense && (
          <div className="sign-component__word sign-component__word--ayursense">
            <SignatureStroke
              signature={AYURSENSE_SIGNATURE}
              active={showAyurSense}
              className="sign-component__svg sign-component__svg--ayursense"
            />
          </div>
        )}
      </div>
      <p className="sign-component__sr">Team AyurSense</p>
    </div>
  );
}
