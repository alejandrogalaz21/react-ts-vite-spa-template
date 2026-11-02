import { useConsent } from '~/analytics';
import { Button } from '~/components/ui';
import { useI18n } from '~/i18n';

/** Privacy notice plus the control to review the analytics consent. */
export function PrivacyView() {
  const { t } = useI18n();
  const copy = t.privacy;
  const [choice, setChoice] = useConsent();

  return (
    <section className="section" aria-labelledby="privacy-title">
      <div className="container prose">
        <h1 id="privacy-title" className="text-h2">
          {copy.title}
        </h1>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2 className="text-h3">{copy.consentTitle}</h2>
        <p>
          {copy.consentCurrent}{' '}
          <strong data-testid="consent-state">{copy.consentStates[choice ?? 'unset']}</strong>
        </p>
        <Button variant="secondary" size="sm" onClick={() => setChoice(null)} disabled={choice === null}>
          {copy.resetConsent}
        </Button>
      </div>
    </section>
  );
}
