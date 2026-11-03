import { Button, TextField } from '#shared/ui';

import { useContactForm } from '../hooks/use-contact-form';
import { useContactText } from '../i18n';
import './contact-form.css';

/** Contact form. `noValidate`: zod validates and messages come from the dictionary. */
export function ContactForm() {
  const copy = useContactText().form;
  const { errors, onSubmit, isPending, isSuccess, isError } = useContactForm();
  const errorText = (key: keyof typeof errors) => {
    const code = errors[key];
    return code ? copy.errors[code] : undefined;
  };

  return (
    <form className="contact-form" noValidate onSubmit={onSubmit}>
      <TextField label={copy.name} name="name" autoComplete="name" required error={errorText('name')} />
      <TextField
        label={copy.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        error={errorText('email')}
      />
      <TextField
        label={copy.message}
        name="message"
        multiline
        required
        rows={6}
        error={errorText('message')}
      />
      <div className="contact-form__footer">
        <Button type="submit" disabled={isPending}>
          {isPending ? copy.sending : copy.submit}
        </Button>
        {/* Live region: announced without moving focus. */}
        <p className="contact-form__status" role="status" data-state={isError ? 'error' : 'success'}>
          {isSuccess && copy.success}
          {isError && copy.error}
        </p>
      </div>
    </form>
  );
}
