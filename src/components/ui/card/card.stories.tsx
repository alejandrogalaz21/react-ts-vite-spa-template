import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    title: 'Lorem ipsum dolor',
    children: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithMeta: Story = { args: { meta: '20 oct 2026 · 4 min' } };
export const WithFooter: Story = { args: { footer: <a href="#lorem">Leer más</a> } };
