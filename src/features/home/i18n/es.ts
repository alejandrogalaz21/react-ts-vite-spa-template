/**
 * Spanish texts of the home feature. Source of the `HomeText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
  meta: {
    title: 'Lorem Studio · Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
  },
  hero: {
    eyebrow: 'Lorem ipsum',
    title: 'Dolor sit amet, consectetur adipiscing elit',
    lead: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    primaryCta: 'Contáctanos',
    secondaryCta: 'Leer el blog',
    imageAlt: 'Ilustración abstracta de formas geométricas',
  },
  features: {
    eyebrow: '01 · Servicios',
    title: 'Ut enim ad minim veniam',
    lead: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    items: [
      {
        title: 'Lorem ipsum',
        body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      },
      {
        title: 'Dolor sit',
        body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
      },
      {
        title: 'Amet consectetur',
        body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        title: 'Adipiscing elit',
        body: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
      },
      {
        title: 'Tempor incididunt',
        body: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.',
      },
      {
        title: 'Magna aliqua',
        body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
      },
    ],
  },
  stats: {
    title: 'Lorem en números',
    items: [
      { value: '120+', label: 'Lorem ipsum' },
      { value: '98%', label: 'Dolor sit amet' },
      { value: '15', label: 'Consectetur' },
    ],
  },
  cta: {
    title: '¿Lorem ipsum dolor sit amet?',
    lead: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.',
    button: 'Escríbenos',
  },
};

/** Shape of the home texts, defined by the Spanish file. */
export type HomeText = typeof es;
