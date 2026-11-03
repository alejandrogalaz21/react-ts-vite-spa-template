import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/shared/styles/tokens.css';
import '../src/shared/styles/global.css';

/** Applies the toolbar theme to <html data-theme>, exactly like public/theme-init.js does in the app. */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  return Story();
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: { icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
};

export default preview;
