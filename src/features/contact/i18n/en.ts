import type { ContactText } from './es';

/** English texts of the contact feature. */
export const en: ContactText = {
  meta: {
    title: 'Contact · Lorem Studio',
    description: 'Write to us: lorem ipsum dolor sit amet.',
  },
  eyebrow: '04 · Contact',
  title: "Let's talk",
  lead: 'Fusce nec tellus sed augue semper porta. We reply within 48 hours.',
  directTitle: 'Direct email',
  form: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send message',
    sending: 'Sending…',
    success: 'Thank you. We received your message and will reply soon.',
    error: 'We could not send the message. Try again in a few minutes.',
    errors: {
      nameRequired: 'Enter your name.',
      emailInvalid: 'Enter a valid email, for example name@domain.com.',
      messageTooShort: 'The message needs at least 20 characters.',
    },
  },
};
