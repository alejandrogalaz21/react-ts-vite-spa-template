import { Icon, SectionHeader } from '~/components/ui';
import { site } from '~/config/site';
import { useI18n } from '~/i18n';

import { ContactForm } from '../components/contact-form';
import './contact-view.css';

/** Contact page body: form plus a direct email fallback. */
export function ContactView() {
  const { t } = useI18n();
  const copy = t.contact;

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
