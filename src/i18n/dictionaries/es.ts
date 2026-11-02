/**
 * Spanish dictionary. It is the source of the `Dictionary` type: every other locale must provide
 * the same keys, so a missing translation is a compile error, not a blank string in production.
 */
export const es = {
  nav: {
    skipToContent: 'Saltar al contenido',
    primary: 'Navegación principal',
    home: 'Inicio',
    about: 'Nosotros',
    blog: 'Blog',
    contact: 'Contacto',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
  },
  theme: {
    toLight: 'Cambiar a tema claro',
    toDark: 'Cambiar a tema oscuro',
  },
  home: {
    meta: {
      title: 'Lorem Studio · Lorem ipsum dolor sit amet',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
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
  },
  about: {
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
  },
  blog: {
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
  },
  contact: {
    meta: {
      title: 'Contacto · Lorem Studio',
      description: 'Escríbenos: lorem ipsum dolor sit amet.',
    },
    eyebrow: '04 · Contacto',
    title: 'Hablemos',
    lead: 'Fusce nec tellus sed augue semper porta. Respondemos en menos de 48 horas.',
    directTitle: 'Correo directo',
    form: {
      name: 'Nombre',
      email: 'Correo electrónico',
      message: 'Mensaje',
      submit: 'Enviar mensaje',
      sending: 'Enviando…',
      success: 'Gracias. Recibimos tu mensaje y te responderemos pronto.',
      error: 'No pudimos enviar el mensaje. Inténtalo de nuevo en unos minutos.',
      errors: {
        nameRequired: 'Escribe tu nombre.',
        emailInvalid: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
        messageTooShort: 'El mensaje necesita al menos 20 caracteres.',
      },
    },
  },
  privacy: {
    meta: {
      title: 'Privacidad · Lorem Studio',
      description: 'Cómo tratamos tus datos y cómo cambiar tu consentimiento de analítica.',
    },
    title: 'Aviso de privacidad',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Este sitio usa analítica solo si la aceptas. Sin tu consentimiento, la medición se hace sin cookies.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nunca enviamos datos personales a terceros.',
    ],
    consentTitle: 'Tu consentimiento',
    consentCurrent: 'Estado actual:',
    consentStates: { granted: 'aceptado', denied: 'rechazado', unset: 'sin decidir' },
    resetConsent: 'Volver a preguntar',
  },
  consent: {
    message: 'Usamos analítica para entender qué contenido es útil. ¿Aceptas cookies de medición?',
    accept: 'Aceptar',
    reject: 'Rechazar',
    learnMore: 'Más información',
  },
  notFound: {
    metaTitle: 'Página no encontrada · Lorem Studio',
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o cambió de dirección.',
    backHome: 'Ir al inicio',
  },
  error: {
    title: 'Algo salió mal',
    body: 'Ocurrió un error inesperado. Recarga la página o vuelve al inicio.',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Privacidad',
    version: 'Versión',
  },
};

export type Dictionary = typeof es;
