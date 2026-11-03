import { z } from 'zod';

/**
 * Contact form payload. Error messages are dictionary keys (see `contact.form.errors`), so the
 * schema stays locale-agnostic and the view translates them.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired'),
  email: z.email('emailInvalid'),
  message: z.string().trim().min(20, 'messageTooShort'),
});

export type ContactMessage = z.output<typeof contactSchema>;
export type ContactErrorKey = 'nameRequired' | 'emailInvalid' | 'messageTooShort';
