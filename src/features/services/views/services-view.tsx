import { Card, SectionHeader } from '#shared/ui';

import { useServicesText } from '../i18n';

/** Services page. Off by default (`pages.services`): it demonstrates the "coming soon" flow. */
export function ServicesView() {
  const copy = useServicesText();

  return (
    <section className="section" aria-labelledby="services-title">
      <div className="container">
        <SectionHeader
          as="h1"
          id="services-title"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
        />
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
