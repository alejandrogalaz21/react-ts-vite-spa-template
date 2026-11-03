import type { ComponentProps } from 'react';

import './button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'sm';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Class list of a button. Use it to style a router `<Link>` or an `<a>` as a button without a
 * polymorphic component: `<Link className={buttonClassName({ variant: 'secondary' })} />`.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleProps = {}): string {
  return ['button', `button--${variant}`, `button--${size}`, className].filter(Boolean).join(' ');
}

export type ButtonProps = ComponentProps<'button'> & ButtonStyleProps;

/** Native `<button>` with the design-system look. Defaults to `type="button"` (never submits by accident). */
export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName({ variant, size, className })} {...props} />;
}
