/**
 * Spanish texts of the legal feature. Source of the `LegalText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
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
    consentCurrent: 'Estado actual:',
    consentStates: { granted: 'aceptado', denied: 'rechazado', unset: 'sin decidir' },
    resetConsent: 'Volver a preguntar',
  },
};

/** Shape of the legal texts, defined by the Spanish file. */
export type LegalText = typeof es;
