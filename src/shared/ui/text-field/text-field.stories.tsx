import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextField } from './text-field';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  args: { label: 'Lorem ipsum', name: 'lorem' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Dolor sit amet, consectetur.' } };
export const WithError: Story = { args: { error: 'Escribe un valor válido.' } };
export const Multiline: Story = { args: { multiline: true } };
