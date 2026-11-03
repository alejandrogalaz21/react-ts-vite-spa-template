/**
 * Spanish texts of the blog feature. Source of the `BlogText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
  meta: {
    title: 'Blog · Lorem Studio',
    description: 'Artículos lorem ipsum sobre dolor sit amet y consectetur.',
  },
  eyebrow: '03 · Blog',
  title: 'Notas y artículos',
  lead: 'Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.',
  readMore: 'Leer artículo',
  publishedOn: 'Publicado el',
  backToBlog: 'Volver al blog',
  minutesRead: 'min de lectura',
  empty: 'Aún no hay artículos.',
};

/** Shape of the blog texts, defined by the Spanish file. */
export type BlogText = typeof es;
