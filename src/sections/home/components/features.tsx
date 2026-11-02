import { Card, SectionHeader } from '~/components/ui';
import { useI18n } from '~/i18n';

/** Grid of service cards. */
export function Features() {
  const { t } = useI18n();
  const copy = t.home.features;

  return (
    <section className="section section--subtle" aria-labelledby="features-title">
      <div className="container">
        <SectionHeader id="features-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        <ul className="grid-auto list-reset">
          {copy.items.map((item) => (
            <li key={item.title}>
              <Card title={item.title}>{item.body}</Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
