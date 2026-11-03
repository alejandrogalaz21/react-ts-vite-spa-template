import { Card, SectionHeader } from '#shared/ui';

import { useHomeText } from '../i18n';

/** Grid of service cards. */
export function Features() {
  const copy = useHomeText().features;

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
