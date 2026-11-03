/**
 * Spanish site-wide dictionary: texts of the site chrome (navigation, theme, consent, footer).
 * Each feature owns its texts in `src/features/<name>/i18n/`.
 *
 * It is the source of the `Dictionary` type: every other locale must provide the same keys, so a
 * missing translation is a compile error, not a blank string in production.
 */
export const es = {
  nav: {
    skipToContent: 'Saltar al contenido',
    primary: 'Navegación principal',
    home: 'Inicio',
    about: 'Nosotros',
    blog: 'Blog',
    contact: 'Contacto',
    services: 'Servicios',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
  },
  theme: {
    toLight: 'Cambiar a tema claro',
    toDark: 'Cambiar a tema oscuro',
  },
  consent: {
    title: 'Tu consentimiento',
    message: 'Usamos analítica para entender qué contenido es útil. ¿Aceptas cookies de medición?',
    accept: 'Aceptar',
    reject: 'Rechazar',
    learnMore: 'Más información',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Privacidad',
    version: 'Versión',
  },
};

export type Dictionary = typeof es;
