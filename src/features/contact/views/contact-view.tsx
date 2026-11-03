import { site } from '#shared/config/site';
import { Icon, SectionHeader } from '#shared/ui';

import { ContactForm } from '../components/contact-form';
import { useContactText } from '../i18n';
import './contact-view.css';

/** Contact page body: form plus a direct email fallback. */
export function ContactView() {
  const copy = useContactText();

  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader
          as="h1"
          id="contact-title"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
        />
        <div className="contact-view">
          <ContactForm />
          <aside className="contact-view__aside" aria-labelledby="contact-direct">
            <h2 id="contact-direct" className="text-h3">
              {copy.directTitle}
            </h2>
            <a href={`mailto:${site.email}`} className="contact-view__mail">
              <Icon name="mail" size={18} />
              {site.email}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
