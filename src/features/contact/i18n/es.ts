/**
 * Spanish texts of the contact feature. Source of the `ContactText` type: every other locale must
 * provide the same keys, so a missing translation is a compile error.
 */
export const es = {
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
};

/** Shape of the contact texts, defined by the Spanish file. */
export type ContactText = typeof es;
