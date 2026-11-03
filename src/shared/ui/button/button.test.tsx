import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, buttonClassName } from './button';

describe('buttonClassName', () => {
  it('defaults to a medium primary button', () => {
    expect(buttonClassName()).toBe('button button--primary button--md');
  });

  it('appends extra classes', () => {
    expect(buttonClassName({ variant: 'ghost', size: 'sm', className: 'x' })).toBe(
      'button button--ghost button--sm x',
    );
  });
});

describe('Button', () => {
  it('never submits a form by default', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button');
  });

  it('accepts an explicit submit type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });
});
