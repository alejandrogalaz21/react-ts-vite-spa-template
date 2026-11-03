import { type ComponentProps, useId } from 'react';

import './text-field.css';

interface BaseProps {
  label: string;
  /** Error message. Sets `aria-invalid` and links the message with `aria-describedby`. */
  error?: string;
  hint?: string;
}

type InputProps = BaseProps & { multiline?: false } & Omit<ComponentProps<'input'>, 'id'>;
type TextareaProps = BaseProps & { multiline: true } & Omit<ComponentProps<'textarea'>, 'id'>;

export type TextFieldProps = InputProps | TextareaProps;

/**
 * Labelled input or textarea with accessible hint and error wiring. The label is always visible
 * (placeholders are not labels).
 */
export function TextField(props: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const { label, error, hint } = props;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const a11y = { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy };

  let control;
  if (props.multiline) {
    const { label: _l, error: _e, hint: _h, multiline: _m, ...rest } = props;
    control = <textarea className="text-field__control text-field__control--multiline" {...rest} {...a11y} />;
  } else {
    const { label: _l, error: _e, hint: _h, multiline: _m, ...rest } = props;
    control = <input className="text-field__control" {...rest} {...a11y} />;
  }

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="text-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {control}
      {error && (
        <p className="text-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
