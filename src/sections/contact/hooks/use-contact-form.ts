import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';

import { sendContactMessage } from '~/actions/contact';
import { track } from '~/analytics';
import { type ContactErrorKey, type ContactMessage, contactSchema } from '~/types/contact';

export type ContactFieldErrors = Partial<Record<keyof ContactMessage, ContactErrorKey>>;

/**
 * Facade hook of the contact form: validation (zod) + submission (React Query mutation) +
 * analytics. The view only renders what this returns.
 */
export function useContactForm() {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const mutation = useMutation({
    mutationFn: (message: ContactMessage) => sendContactMessage(message),
    onSuccess: () => track('contact_submit', { status: 'success' }),
    onError: () => track('contact_submit', { status: 'error' }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      const next: ContactFieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactMessage;
        next[field] ??= issue.message as ContactErrorKey;
      }
      setErrors(next);
      // Move focus to the first invalid field so keyboard and screen reader users land on it.
      const first = result.error.issues[0]?.path[0];
      const field = typeof first === 'string' ? form.elements.namedItem(first) : null;
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setErrors({});
    mutation.mutate(result.data, { onSuccess: () => form.reset() });
  }

  return {
    errors,
    onSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
