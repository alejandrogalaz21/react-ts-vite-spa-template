import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Storybook documents the design-system primitives (src/shared/ui). It uses its own Vite
 * config: the React Router plugin in vite.config.ts builds a full app and does not run here.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } },
  },
  core: { disableTelemetry: true },
};

export default config;
