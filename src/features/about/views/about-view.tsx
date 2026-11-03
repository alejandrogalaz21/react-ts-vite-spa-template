import { Card, SectionHeader } from '#shared/ui';

import { useAboutText } from '../i18n';

/** About page body: intro, prose and values grid. */
export function AboutView() {
  const copy = useAboutText();

  return (
    <>
      <section className="section" aria-labelledby="about-title">
        <div className="container">
          <SectionHeader
            as="h1"
            id="about-title"
            eyebrow={copy.eyebrow}
            title={copy.title}
            lead={copy.lead}
          />
          <div className="prose">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--subtle" aria-labelledby="values-title">
        <div className="container">
          <SectionHeader id="values-title" title={copy.valuesTitle} />
          <ul className="grid-auto list-reset">
            {copy.values.map((value) => (
              <li key={value.title}>
                <Card title={value.title}>{value.body}</Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
