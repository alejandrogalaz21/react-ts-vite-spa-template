import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextField } from './text-field';

describe('TextField', () => {
  it('labels the control', () => {
    render(<TextField label="Email" name="email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('marks the control invalid and describes it with the error', () => {
    render(<TextField label="Email" name="email" error="Invalid email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Invalid email');
  });

  it('renders a textarea when multiline', () => {
    render(<TextField label="Message" name="message" multiline />);
    expect(screen.getByRole('textbox', { name: 'Message' }).tagName).toBe('TEXTAREA');
  });
});
