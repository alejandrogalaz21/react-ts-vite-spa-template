/**
 * Spanish texts of the status feature. Source of the `StatusText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
  comingSoon: {
    metaTitle: 'Próximamente · Lorem Studio',
    eyebrow: 'Próximamente',
    title: 'Estamos preparando esta página',
    body: 'Esta sección todavía no está disponible. Vuelve pronto o escríbenos si necesitas algo.',
    backHome: 'Ir al inicio',
    contact: 'Contáctanos',
  },
  notFound: {
    metaTitle: 'Página no encontrada · Lorem Studio',
    eyebrow: 'Error 404',
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o cambió de dirección.',
    backHome: 'Ir al inicio',
    suggestions: 'Quizá buscabas',
  },
  error: {
    title: 'Algo salió mal',
    body: 'Ocurrió un error inesperado. Recarga la página o vuelve al inicio.',
  },
};

/** Shape of the status texts, defined by the Spanish file. */
export type StatusText = typeof es;
