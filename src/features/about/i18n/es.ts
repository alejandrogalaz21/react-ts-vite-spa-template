/**
 * Spanish texts of the about feature. Source of the `AboutText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
  meta: {
    title: 'Nosotros · Lorem Studio',
    description: 'Lorem ipsum dolor sit amet: quiénes somos y cómo trabajamos.',
  },
  eyebrow: '02 · Nosotros',
  title: 'Temporibus autem quibusdam',
  lead: 'Et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.',
  paragraphs: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
    'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.',
  ],
  valuesTitle: 'Nuestros valores',
  values: [
    { title: 'Curabitur', body: 'Sodales ligula in libero. Sed dignissim lacinia nunc.' },
    { title: 'Vestibulum', body: 'Curabitur tortor. Pellentesque nibh. Aenean quam.' },
    {
      title: 'Maecenas',
      body: 'Mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.',
    },
  ],
};

/** Shape of the about texts, defined by the Spanish file. */
export type AboutText = typeof es;
