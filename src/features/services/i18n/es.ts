/**
 * Spanish texts of the services feature. Source of the `ServicesText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
  meta: {
    title: 'Servicios · Lorem Studio',
    description: 'Lorem ipsum dolor sit amet: consectetur, adipiscing y eiusmod tempor para tu proyecto.',
  },
  eyebrow: 'Servicios',
  title: 'Lorem ipsum para cada etapa',
  lead: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  items: [
    {
      title: 'Consectetur',
      body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    },
    { title: 'Adipiscing', body: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.' },
    { title: 'Eiusmod', body: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.' },
  ],
};

/** Shape of the services texts, defined by the Spanish file. */
export type ServicesText = typeof es;
