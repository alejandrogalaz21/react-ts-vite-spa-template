import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionHeader } from './section-header';

const meta = {
  title: 'UI/SectionHeader',
  component: SectionHeader,
  args: {
    eyebrow: '01 · Lorem',
    title: 'Ut enim ad minim veniam',
    lead: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PageTitle: Story = { args: { as: 'h1' } };
export const Centered: Story = { args: { align: 'center' } };
